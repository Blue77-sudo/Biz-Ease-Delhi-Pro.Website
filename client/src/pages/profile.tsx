import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, MapPin, Phone, Mail, Globe, Users, Calendar, Edit, Save, X } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { translations } from "@/lib/translations";

const profileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  businessType: z.string().min(1, "Business type is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  website: z.string().optional(),
  employees: z.string().min(1, "Number of employees is required"),
  establishedYear: z.string().min(4, "Valid year is required"),
  description: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { language } = useAuthStore();
  const t = translations[language];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      companyName: "Delhi Manufacturing Ltd.",
      businessType: "Manufacturing",
      address: "Block A, Industrial Area",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      phone: "+91 98765 43210",
      email: "info@delhimanufacturing.com",
      website: "www.delhimanufacturing.com",
      employees: "50-100",
      establishedYear: "2015",
      description: "Leading manufacturer of industrial components in Delhi NCR region.",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("Profile updated:", data);
    setIsEditing(false);
  };

  const businessTypes = [
    "Manufacturing", "Trading", "Service", "Retail", "Technology", "Healthcare", "Education", "Food & Beverage"
  ];

  const employeeRanges = [
    "1-10", "11-50", "51-100", "101-500", "500+"
  ];

  return (
    <div className="p-3 sm:p-6 lg:p-8 xl:p-12 max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">
          {t.businessProfile}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl lg:max-w-4xl">
          Manage your business information and profile details. This information is used for license applications and compliance tracking.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

          {/* Basic Information Card */}
          <Card className="card-hover lg:col-span-2 xl:col-span-2">
            <CardHeader className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2 lg:gap-3">
                    <Building2 className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                    Basic Information
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base mt-1 lg:mt-2">
                    Company details and contact information
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant={isEditing ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="lg:px-6 lg:py-3 lg:text-base"
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 pt-0 lg:pt-0 space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="companyName" className="lg:text-base font-medium">Company Name</Label>
                  <Input
                    id="companyName"
                    {...register("companyName")}
                    disabled={!isEditing}
                    className="mt-1 lg:mt-2 lg:h-12 lg:text-base"
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-xs lg:text-sm mt-1">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="businessType" className="lg:text-base font-medium">Business Type</Label>
                  <Select disabled={!isEditing} defaultValue={watch("businessType")}>
                    <SelectTrigger className="mt-1 lg:mt-2 lg:h-12 lg:text-base">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type} className="lg:text-base">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="lg:text-base font-medium">Address</Label>
                <Textarea
                  id="address"
                  {...register("address")}
                  disabled={!isEditing}
                  className="mt-1 lg:mt-2 lg:min-h-24 lg:text-base"
                  rows={3}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs lg:text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="city" className="lg:text-base font-medium">City</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    disabled={!isEditing}
                    className="mt-1 lg:mt-2 lg:h-12 lg:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="lg:text-base font-medium">State</Label>
                  <Input
                    id="state"
                    {...register("state")}
                    disabled={!isEditing}
                    className="mt-1 lg:mt-2 lg:h-12 lg:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode" className="lg:text-base font-medium">Pincode</Label>
                  <Input
                    id="pincode"
                    {...register("pincode")}
                    disabled={!isEditing}
                    className="mt-1 lg:mt-2 lg:h-12 lg:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="phone" className="lg:text-base font-medium">Phone</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    disabled={!isEditing}
                    className="mt-1 lg:mt-2 lg:h-12 lg:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="lg:text-base font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled={!isEditing}
                    className="mt-1 lg:mt-2 lg:h-12 lg:text-base"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details Card */}
          <Card className="card-hover lg:col-span-2 xl:col-span-1">
            <CardHeader className="p-4 sm:p-6 lg:p-8">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2 lg:gap-3">
                <Users className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 pt-0 lg:pt-0 space-y-4 lg:space-y-6">
              <div>
                <Label htmlFor="website" className="lg:text-base font-medium">Website</Label>
                <Input
                  id="website"
                  {...register("website")}
                  disabled={!isEditing}
                  className="mt-1 lg:mt-2 lg:h-12 lg:text-base"
                  placeholder="www.example.com"
                />
              </div>
              <div>
                <Label htmlFor="employees" className="lg:text-base font-medium">Number of Employees</Label>
                <Select disabled={!isEditing} defaultValue={watch("employees")}>
                  <SelectTrigger className="mt-1 lg:mt-2 lg:h-12 lg:text-base">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeRanges.map((range) => (
                      <SelectItem key={range} value={range} className="lg:text-base">
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="establishedYear" className="lg:text-base font-medium">Established Year</Label>
                <Input
                  id="establishedYear"
                  {...register("establishedYear")}
                  disabled={!isEditing}
                  className="mt-1 lg:mt-2 lg:h-12 lg:text-base"
                  placeholder="2020"
                />
              </div>
              <div>
                <Label htmlFor="description" className="lg:text-base font-medium">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  disabled={!isEditing}
                  className="mt-1 lg:mt-2 lg:min-h-32 lg:text-base"
                  rows={4}
                  placeholder="Brief description of your business..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3 lg:gap-4 pt-4 lg:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="lg:px-8 lg:py-3 lg:text-base"
            >
              Cancel
            </Button>
            <Button type="submit" className="lg:px-8 lg:py-3 lg:text-base">
              <Save className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}