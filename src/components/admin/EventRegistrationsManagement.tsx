import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Mail, Phone, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";

interface EventRegistration {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  program_id: string;
  created_at: string;
  upcoming_programs: {
    id: string;
    title: string;
    start_date: string;
  } | null;
}

export const EventRegistrationsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProgram, setSelectedProgram] = useState<string>("all");

  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ["admin-upcoming-programs-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_programs")
        .select("id, title, start_date")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: registrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ["admin-event-registrations", selectedProgram],
    queryFn: async () => {
      let query = supabase
        .from("event_registrations")
        .select(`
          id,
          full_name,
          email,
          phone,
          program_id,
          created_at,
          upcoming_programs (
            id,
            title,
            start_date
          )
        `)
        .order("created_at", { ascending: false });

      if (selectedProgram !== "all") {
        query = query.eq("program_id", selectedProgram);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as EventRegistration[];
    },
  });

  const deleteRegistration = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-event-registrations"] });
      toast({ title: "Registration deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting registration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getRegistrationCount = (programId: string) => {
    if (!registrations) return 0;
    return registrations.filter((r) => r.program_id === programId).length;
  };

  const isLoading = programsLoading || registrationsLoading;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Event Registrations
            </CardTitle>
            <CardDescription>
              View and manage event registrations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-[200px] sm:w-[280px]">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {programs?.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : registrations && registrations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No registrations found</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            {selectedProgram === "all" && programs && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {programs.slice(0, 6).map((program) => {
                  const count = getRegistrationCount(program.id);
                  if (count === 0) return null;
                  return (
                    <Card
                      key={program.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedProgram(program.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm line-clamp-1">
                              {program.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(program.start_date), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-lg px-3">
                            {count}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Mobile View */}
            <div className="space-y-4 md:hidden">
              {registrations?.map((registration) => (
                <Card key={registration.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{registration.full_name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Mail className="h-3 w-3" />
                          <span>{registration.email}</span>
                        </div>
                        {registration.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{registration.phone}</span>
                          </div>
                        )}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this registration? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteRegistration.mutate(registration.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    {registration.upcoming_programs && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-primary" />
                        <span className="text-xs">{registration.upcoming_programs.title}</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Registered: {format(new Date(registration.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-sm">Name</th>
                    <th className="text-left p-2 text-sm">Email</th>
                    <th className="text-left p-2 text-sm">Phone</th>
                    <th className="text-left p-2 text-sm">Event</th>
                    <th className="text-left p-2 text-sm">Registered</th>
                    <th className="text-left p-2 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations?.map((registration) => (
                    <tr key={registration.id} className="border-b hover:bg-accent/50">
                      <td className="p-2 text-sm font-medium">{registration.full_name}</td>
                      <td className="p-2 text-sm">{registration.email}</td>
                      <td className="p-2 text-sm">{registration.phone || "-"}</td>
                      <td className="p-2 text-sm max-w-[200px]">
                        <span className="line-clamp-1">
                          {registration.upcoming_programs?.title || "Unknown Event"}
                        </span>
                      </td>
                      <td className="p-2 text-sm">
                        {format(new Date(registration.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="p-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this registration? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteRegistration.mutate(registration.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Count */}
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Total: {registrations?.length || 0} registration{registrations?.length !== 1 ? "s" : ""}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EventRegistrationsManagement;
