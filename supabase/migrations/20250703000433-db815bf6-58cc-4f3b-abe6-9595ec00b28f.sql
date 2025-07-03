-- Ajouter la colonne product_type manquante
ALTER TABLE public.products 
ADD COLUMN product_type TEXT NOT NULL DEFAULT 'product';

-- Créer la table pour les templates de factures
CREATE TABLE public.invoice_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_position TEXT DEFAULT 'top-left',
  color_scheme JSONB DEFAULT '{"primary": "#3b82f6", "secondary": "#64748b"}',
  font_family TEXT DEFAULT 'Inter',
  layout_type TEXT DEFAULT 'modern',
  custom_css TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS pour les templates
ALTER TABLE public.invoice_templates ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les templates
CREATE POLICY "Users can manage their invoice templates" 
ON public.invoice_templates 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Ajouter les colonnes pour personnalisation des factures
ALTER TABLE public.invoices 
ADD COLUMN template_id UUID REFERENCES public.invoice_templates(id),
ADD COLUMN custom_styling JSONB DEFAULT '{}',
ADD COLUMN ttc_amount NUMERIC DEFAULT 0;

-- Créer la table pour les notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS pour les notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les notifications
CREATE POLICY "Users can manage their notifications" 
ON public.notifications 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Activer la réplication en temps réel
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.invoices REPLICA IDENTITY FULL;
ALTER TABLE public.clients REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;

-- Ajouter les tables aux publications en temps réel
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- Fonction pour créer des notifications automatiques
CREATE OR REPLACE FUNCTION public.create_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'invoices' THEN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.notifications (user_id, title, message, type, metadata)
      VALUES (
        NEW.user_id,
        'Nouvelle facture créée',
        'La facture ' || COALESCE(NEW.number, 'sans numéro') || ' a été créée avec succès.',
        'success',
        jsonb_build_object('invoice_id', NEW.id, 'invoice_number', NEW.number)
      );
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
      INSERT INTO public.notifications (user_id, title, message, type, metadata)
      VALUES (
        NEW.user_id,
        'Statut de facture modifié',
        'Le statut de la facture ' || COALESCE(NEW.number, 'sans numéro') || ' est passé à ' || NEW.status || '.',
        'info',
        jsonb_build_object('invoice_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status)
      );
    END IF;
  ELSIF TG_TABLE_NAME = 'clients' AND TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (user_id, title, message, type, metadata)
    VALUES (
      NEW.user_id,
      'Nouveau client ajouté',
      'Le client ' || NEW.name || ' a été ajouté avec succès.',
      'success',
      jsonb_build_object('client_id', NEW.id, 'client_name', NEW.name)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger pour les notifications automatiques
CREATE TRIGGER invoice_notifications_trigger
  AFTER INSERT OR UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.create_notification();

CREATE TRIGGER client_notifications_trigger
  AFTER INSERT ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.create_notification();

-- Trigger pour mise à jour automatique du TTC
CREATE OR REPLACE FUNCTION public.update_invoice_ttc()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ttc_amount = NEW.total_amount + NEW.tva_total;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_invoice_ttc_trigger
  BEFORE INSERT OR UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_invoice_ttc();