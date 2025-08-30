
import { supabase } from "@/integrations/supabase/client";

export const fetchDocumentData = async (documentId: string, documentType: "invoice" | "quote" | "delivery_note") => {
  let query;
  
  switch (documentType) {
    case "invoice":
      query = supabase
        .from("invoices")
        .select(`
          *,
          clients(name, email, phone, address),
          companies(name, address, phone, email, logo_url),
          invoice_items(description, quantity, unit_price, tva, total)
        `)
        .eq("id", documentId)
        .single();
      break;
    case "quote":
      query = supabase
        .from("quotes")
        .select(`
          *,
          invoices!inner(
            clients(name, email, phone, address),
            companies(name, address, phone, email, logo_url),
            invoice_items(description, quantity, unit_price, tva, total)
          )
        `)
        .eq("id", documentId)
        .single();
      break;
    case "delivery_note":
      query = supabase
        .from("delivery_notes")
        .select(`
          *,
          invoices!inner(
            clients(name, email, phone, address),
            companies(name, address, phone, email, logo_url),
            invoice_items(description, quantity, unit_price, tva, total)
          )
        `)
        .eq("id", documentId)
        .single();
      break;
    default:
      throw new Error("Type de document non supporté");
  }

  const { data, error } = await query;
  if (error) throw error;
  
  return data;
};
