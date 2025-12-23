"use client";

import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { trackEvent } from "../download";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ContactFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactFormDialog({ isOpen, onClose }: ContactFormDialogProps) {
  const { t } = useTranslation();

  // Track when the form was loaded (anti-bot timing check)
  const formLoadedAt = useMemo(() => Date.now(), []);

  // Honeypot field state (should remain empty for real users)
  const [honeypot, setHoneypot] = useState("");

  const contactFormSchema = z.object({
    name: z.string().min(2, t("contact.form.name.error")).max(100, t("contact.form.name.errorMax")),
    email: z.email(t("contact.form.email.error")).max(254, t("contact.form.email.errorMax")),
    message: z
      .string()
      .min(10, t("contact.form.message.error"))
      .max(5000, t("contact.form.message.errorMax")),
  });

  type ContactFormValues = z.infer<typeof contactFormSchema>;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Reset honeypot when dialog opens
  useEffect(() => {
    if (isOpen) {
      setHoneypot("");
    }
  }, [isOpen]);

  const handleClose = () => {
    form.reset();
    setHoneypot("");
    onClose();
  };

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          // Anti-bot fields
          website: honeypot, // Honeypot (should be empty)
          formLoadedAt, // Timing check
        }),
      });

      // Handle rate limiting
      if (response.status === 429) {
        const data = await response.json();
        toast.error(t("contact.form.error.rateLimit"), {
          description: data.message || t("contact.form.error.rateLimitDescription"),
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Falha ao enviar mensagem");
      }

      trackEvent("Contact Form Submit", {
        name: values.name,
        email: values.email,
      });

      form.reset();
      onClose();

      toast.success(t("contact.form.success.title"), {
        description: t("contact.form.success.description"),
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error(t("contact.form.error.title"), {
        description: t("contact.form.error.description"),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-bold text-foreground mb-2">{t("contact.title")}</h3>
        <p className="text-muted-foreground mb-6">{t("contact.subtitle")}</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* 
              Honeypot field - hidden from real users, filled by bots.
              Using CSS to hide instead of display:none which bots might detect.
              The "website" field name is attractive to bots.
            */}
            <div
              aria-hidden="true"
              tabIndex={-1}
              style={{
                position: "absolute",
                left: "-9999px",
                opacity: 0,
                height: 0,
                overflow: "hidden",
              }}
            >
              <label htmlFor="website">Website (leave empty)</label>
              <input
                type="text"
                id="website"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contact.form.name.label")}</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder={t("contact.form.name.placeholder")}
                      maxLength={100}
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contact.form.email.label")}</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="email"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder={t("contact.form.email.placeholder")}
                      maxLength={254}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contact.form.message.label")}</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={4}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      placeholder={t("contact.form.message.placeholder")}
                      maxLength={5000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                {t("contact.form.cancel")}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? t("contact.form.sending") : t("contact.form.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
