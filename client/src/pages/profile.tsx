import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/lib/auth";
import { translations } from "@/lib/translations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  gstin: z.string().optional(),
  udyamNumber: z.string().optional(),
  businessAddress: z.string().min(1, "Business address is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, businessProfile, setBusinessProfile, language } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = translations[language];

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile", user?.id],
    enabled: !!user?.id,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      businessName: businessProfile?.businessName || "",
      businessType: businessProfile?.businessType || "",
      gstin: businessProfile?.gstin || "",
      udyamNumber: businessProfile?.udyamNumber || "",
      businessAddress: businessProfile?.businessAddress || "",
      contactEmail: businessProfile?.contactEmail || "",
      contactPhone: businessProfile?.contactPhone || "",
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => 
      apiRequest("POST", "/api/profile", { ...data, userId: user?.id }),
    onSuccess: async (response) => {
      const newProfile = await response.json();
      setBusinessProfile(newProfile);
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Success",
        description: "Profile created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => 
      apiRequest("PUT", `/api/profile/${user?.id}`, data),
    onSuccess: async (response) => {
      const updatedProfile = await response.json();
      setBusinessProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    if (businessProfile) {
      updateProfileMutation.mutate(data);
    } else {
      createProfileMutation.mutate(data);
    }
  };

  const getProfileCompletion = () => {
    if (!businessProfile) return 0;

    const fields = [
      businessProfile.businessName,
      businessProfile.businessType,
      businessProfile.businessAddress,
      businessProfile.contactEmail,
      businessProfile.contactPhone,
      businessProfile.gstin,
      businessProfile.udyamNumber,
    ];

    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const businessTypes = [
    { value: "manufacturing", label: t.manufacturing },
    { value: "service", label: t.service },
    { value: "retail", label: t.retail },
    { value: "it", label: t.it },
    { value: "other", label: t.other },
  ];

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-gray-200 rounded" />
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded" />
              <div className="h-48 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-desktop page-content">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.profileTitle}</h1>
        <p className="text-gray-600">{t.profileSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t.businessDetails}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.businessNameLabel}</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Delhi Innovations Pvt. Ltd." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.businessTypeLabel}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t.selectType} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {businessTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="gstin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.gstinLabel}</FormLabel>
                          <FormControl>
                            <Input placeholder="07AABCU9603R1ZX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="udyamNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.udyamLabel}</FormLabel>
                          <FormControl>
                            <Input placeholder="UDYAM-DL-06-0123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="businessAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.businessAddressLabel}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Complete business address in Delhi" 
                            rows={3} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.emailLabel}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="business@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.phoneLabel}</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 98765 43210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline">
                      {t.cancelBtn}
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createProfileMutation.isPending || updateProfileMutation.isPending}
                    >
                      {(createProfileMutation.isPending || updateProfileMutation.isPending) && (
                        <div className="loading-spinner mr-2" />
                      )}
                      {t.saveProfileBtn}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Profile Complete</span>
                <span className="text-sm font-semibold text-green-600">{getProfileCompletion()}%</span>
              </div>
              <Progress value={getProfileCompletion()} className="w-full" />
              {getProfileCompletion() < 100 && (
                <div className="text-xs text-gray-500">
                  Complete your profile to access all features
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Registrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">GST Registration</span>
                <Badge className="status-approved">{t.active}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Shop & Establishment</span>
                <Badge className="status-approved">{t.active}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">MSME Registration</span>
                <Badge className="status-pending">{t.pending}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}