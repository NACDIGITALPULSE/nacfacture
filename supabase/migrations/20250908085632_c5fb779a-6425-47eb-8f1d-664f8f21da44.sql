-- Corriger les problèmes de sécurité du linter
-- Fixer le search_path pour les fonctions existantes

-- Fonction update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fonction update_invoice_ttc
CREATE OR REPLACE FUNCTION public.update_invoice_ttc()
RETURNS trigger
LANGUAGE plpgsql  
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.ttc_amount = NEW.total_amount + NEW.tva_total;
  RETURN NEW;
END;
$$;

-- Fonction create_notification
CREATE OR REPLACE FUNCTION public.create_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;