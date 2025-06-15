
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MessageSquare, Send } from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    landlord_id: string;
  };
  onSuccess?: () => void;
}

const InquiryModal = ({ isOpen, onClose, property, onSuccess }: InquiryModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    inquiry_type: "general"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create inquiry
      const { error: inquiryError } = await supabase
        .from('inquiries')
        .insert({
          property_id: property.id,
          sender_id: user.id,
          receiver_id: property.landlord_id,
          subject: formData.subject,
          message: formData.message,
          inquiry_type: formData.inquiry_type
        });

      if (inquiryError) throw inquiryError;

      // Increment inquiry count
      await supabase.rpc('increment_inquiry_count', {
        property_uuid: property.id
      });

      // Create notification for landlord
      await supabase
        .from('notifications')
        .insert({
          user_id: property.landlord_id,
          title: 'New Property Inquiry',
          message: `You have a new inquiry for "${property.title}"`,
          type: 'info',
          related_property_id: property.id
        });

      onSuccess?.();
      onClose();
      setFormData({ subject: "", message: "", inquiry_type: "general" });
    } catch (error) {
      console.error('Error sending inquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Landlord
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="inquiry-type">Inquiry Type</Label>
            <Select
              value={formData.inquiry_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, inquiry_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="viewing">Schedule Viewing</SelectItem>
                <SelectItem value="application">Rental Application</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter subject..."
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Inquiry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryModal;
