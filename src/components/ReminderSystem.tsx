
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReminderFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  type: "payment" | "followup" | "task";
  relatedInvoiceId?: string;
}

const ReminderSystem = () => {
  const [formData, setFormData] = React.useState<ReminderFormData>({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    type: "task"
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ici, vous ajouteriez la logique pour sauvegarder le rappel
      console.log("Nouveau rappel:", formData);
      
      toast({
        title: "Rappel créé",
        description: "Le rappel a été créé avec succès"
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        type: "task"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le rappel",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ReminderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Créer un rappel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du rappel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ex: Relancer le client ABC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de rappel</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Paiement</SelectItem>
                  <SelectItem value="followup">Suivi client</SelectItem>
                  <SelectItem value="task">Tâche générale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Détails du rappel..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {isSubmitting ? "Création..." : "Créer le rappel"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReminderSystem;
