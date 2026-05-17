"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

const preArrivalDefault = `Hello {guest_name},

Welcome to SOYL Residency! Your room {room_number} is ready for you.

Check-in date: {check_in_date}
Check-in time: 2:00 PM

Please carry a valid ID proof. We look forward to hosting you!

Warm regards,
SOYL Residency`;

const postStayDefault = `Dear {guest_name},

Thank you for staying with us at SOYL Residency (Room {room_number}).

We hope you had a pleasant experience. We'd love to hear your feedback!

If you'd like to book again, reach us at +91 80 4567 8900.

See you soon!
SOYL Residency`;

const sampleData: Record<string, string> = {
  "{guest_name}": "Rajesh Kumar",
  "{room_number}": "101",
  "{check_in_date}": "18 May 2025",
  "{check_out_date}": "20 May 2025",
};

function renderPreview(template: string): string {
  let rendered = template;
  Object.entries(sampleData).forEach(([key, val]) => {
    rendered = rendered.replaceAll(key, val);
  });
  return rendered;
}

export default function MessagingPage() {
  const [preArrival, setPreArrival] = useState(preArrivalDefault);
  const [postStay, setPostStay] = useState(postStayDefault);

  function handleSend(type: string) {
    toast.success(`${type} message sent via WhatsApp`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-soyl-bg pb-6"
    >
      <div className="mx-auto max-w-2xl px-4">
        <PageHeader title="Guest Messaging" />

        <Tabs defaultValue="pre-arrival">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="pre-arrival" className="flex-1">Pre-arrival</TabsTrigger>
            <TabsTrigger value="post-stay" className="flex-1">Post-stay</TabsTrigger>
          </TabsList>

          <TabsContent value="pre-arrival">
            <TemplateEditor
              template={preArrival}
              onChange={setPreArrival}
              onSend={() => handleSend("Pre-arrival")}
            />
          </TabsContent>

          <TabsContent value="post-stay">
            <TemplateEditor
              template={postStay}
              onChange={setPostStay}
              onSend={() => handleSend("Post-stay")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}

function TemplateEditor({
  template,
  onChange,
  onSend,
}: {
  template: string;
  onChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-soyl-text">
          Template
        </label>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {Object.keys(sampleData).map((placeholder) => (
            <button
              key={placeholder}
              type="button"
              onClick={() => {
                onChange(template + placeholder);
              }}
              className="rounded-full bg-soyl-primary/10 px-2.5 py-1 text-xs font-medium text-soyl-primary hover:bg-soyl-primary/20"
            >
              {placeholder}
            </button>
          ))}
        </div>
        <Textarea
          value={template}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          className="font-mono text-sm"
        />
      </div>

      <Card className="border-soyl-border">
        <CardContent className="py-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-soyl-muted">
            Preview
          </p>
          <pre className="whitespace-pre-wrap text-sm text-soyl-text">
            {renderPreview(template)}
          </pre>
        </CardContent>
      </Card>

      <Button
        onClick={onSend}
        className="min-h-touch w-full gap-2 bg-[#25D366] text-white hover:bg-[#1da851]"
      >
        <Send className="size-4" />
        Send via WhatsApp
      </Button>
    </div>
  );
}
