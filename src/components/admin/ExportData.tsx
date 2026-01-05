import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ExportType = "donations" | "members" | "newsletters" | "contacts";

const convertToCSV = (data: any[], type: ExportType): string => {
  if (!data || data.length === 0) return "";

  const headers: Record<ExportType, string[]> = {
    donations: ["Donor Name", "Email", "Phone", "Amount", "Frequency", "Payment Status", "Payment Method", "Transaction Ref", "Date"],
    members: ["Full Name", "Email", "Phone", "Membership Type", "Status", "Skills", "Motivation", "Joined Date"],
    newsletters: ["Email", "Subscribed Date"],
    contacts: ["Name", "Email", "Phone", "Message", "Date"],
  };

  const getRow = (item: any, type: ExportType): string[] => {
    switch (type) {
      case "donations":
        return [
          item.donor_name || "",
          item.email || "",
          item.phone || "",
          item.amount?.toString() || "",
          item.frequency || "",
          item.payment_status || "",
          item.payment_method || "",
          item.transaction_reference || "",
          new Date(item.created_at).toLocaleDateString(),
        ];
      case "members":
        return [
          item.full_name || "",
          item.email || "",
          item.phone || "",
          item.membership_type || "",
          item.status || "",
          item.skills || "",
          item.motivation || "",
          new Date(item.joined_at).toLocaleDateString(),
        ];
      case "newsletters":
        return [
          item.email || "",
          new Date(item.subscribed_at).toLocaleDateString(),
        ];
      case "contacts":
        return [
          item.name || "",
          item.email || "",
          item.phone || "",
          item.message?.replace(/"/g, '""') || "",
          new Date(item.created_at).toLocaleDateString(),
        ];
      default:
        return [];
    }
  };

  const csvHeaders = headers[type].join(",");
  const csvRows = data.map((item) => 
    getRow(item, type)
      .map((cell) => `"${cell}"`)
      .join(",")
  );

  return [csvHeaders, ...csvRows].join("\n");
};

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const ExportData = () => {
  const [exporting, setExporting] = useState<ExportType | null>(null);

  const handleExport = async (type: ExportType) => {
    setExporting(type);
    try {

      let data: any[] | null = null;
      let error: any = null;

      if (type === "donations") {
        const result = await supabase.from("donations").select("*").order("created_at", { ascending: false });
        data = result.data;
        error = result.error;
      } else if (type === "members") {
        const result = await supabase.from("members").select("*").order("joined_at", { ascending: false });
        data = result.data;
        error = result.error;
      } else if (type === "newsletters") {
        const result = await supabase.from("newsletter_subscriptions").select("*").order("subscribed_at", { ascending: false });
        data = result.data;
        error = result.error;
      } else if (type === "contacts") {
        const result = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error(`No ${type} data to export`);
        return;
      }

      const csv = convertToCSV(data, type);
      const filename = `regamos-${type}-${new Date().toISOString().split("T")[0]}.csv`;
      downloadCSV(csv, filename);
      
      toast.success(`Exported ${data.length} ${type} records`);
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error(`Failed to export ${type}: ${error.message}`);
    } finally {
      setExporting(null);
    }
  };

  const exportOptions: { type: ExportType; label: string; description: string }[] = [
    { type: "donations", label: "Donations", description: "Export all donation records with payment details" },
    { type: "members", label: "Members", description: "Export membership applications and status" },
    { type: "newsletters", label: "Newsletter Subscribers", description: "Export newsletter email list" },
    { type: "contacts", label: "Contact Submissions", description: "Export contact form messages" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>Download data as CSV files for reporting and analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {exportOptions.map((option) => (
            <Card key={option.type} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold">{option.label}</h4>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport(option.type)}
                  disabled={exporting !== null}
                >
                  {exporting === option.type ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
