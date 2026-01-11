import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAdminProduct, useUpsertProduct } from "@/hooks/useAdminProducts";

const formSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  nom_commercial: z.string().optional().nullable(),
  nom_latin: z.string().optional().nullable(),
  famille_olfactive: z.string().optional().nullable(),
  profil_olfactif: z.string().optional().nullable(),
  origine: z.string().optional().nullable(),
  tracabilite: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  aspect: z.string().optional().nullable(),
  certifications: z.string().optional().nullable(),
  valorisations: z.string().optional().nullable(),
  food_grade: z.string().optional().nullable(),
  statut: z.string().default("ACTIF"),
  image_url: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ParfumEditPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const isNew = code === "new";

  const { data: product, isLoading } = useAdminProduct("parfum", isNew ? null : code || null);
  const upsertMutation = useUpsertProduct("parfum");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      nom_commercial: "",
      nom_latin: "",
      famille_olfactive: "",
      profil_olfactif: "",
      origine: "",
      tracabilite: "",
      description: "",
      aspect: "",
      certifications: "",
      valorisations: "",
      food_grade: "",
      statut: "ACTIF",
      image_url: "",
    },
  });

  // Populate form when product loads
  useEffect(() => {
    if (product) {
      form.reset({
        code: (product.code as string) || "",
        nom_commercial: (product.nom_commercial as string) || "",
        nom_latin: (product.nom_latin as string) || "",
        famille_olfactive: (product.famille_olfactive as string) || "",
        profil_olfactif: (product.profil_olfactif as string) || "",
        origine: (product.origine as string) || "",
        tracabilite: (product.tracabilite as string) || "",
        description: (product.description as string) || "",
        aspect: (product.aspect as string) || "",
        certifications: (product.certifications as string) || "",
        valorisations: (product.valorisations as string) || "",
        food_grade: (product.food_grade as string) || "",
        statut: (product.statut as string) || "ACTIF",
        image_url: (product.image_url as string) || "",
      });
    }
  }, [product, form]);

  const onSubmit = async (values: FormValues) => {
    await upsertMutation.mutateAsync(values);
    navigate("/admin/parfums");
  };

  if (!isNew && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/parfums")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isNew ? "Nouveau parfum" : "Modifier le parfum"}
          </h1>
          {!isNew && product?.nom_commercial && (
            <p className="text-muted-foreground">{product.nom_commercial}</p>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code *</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isNew} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nom_commercial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom commercial</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nom_latin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom latin</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="famille_olfactive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Famille olfactive</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="origine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origine</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="statut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ACTIF">Actif</SelectItem>
                            <SelectItem value="INACTIF">Inactif</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aspect"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aspect</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="food_grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food grade</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} value={field.value || ""} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="profil_olfactif"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profil olfactif</FormLabel>
                          <FormControl>
                            <Textarea {...field} value={field.value || ""} rows={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications & Traçabilité</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tracabilite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Traçabilité</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certifications</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valorisations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valorisations</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Image sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            folder="parfums"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Fixed save button on mobile */}
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t border-border lg:static lg:border-0 lg:p-0 lg:bg-transparent">
            <Button
              type="submit"
              className="w-full lg:w-auto"
              disabled={upsertMutation.isPending}
            >
              {upsertMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Enregistrer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
