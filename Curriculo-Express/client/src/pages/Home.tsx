import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeDataSchema, type ResumeData } from "@shared/schema";
import { useCreateResume } from "@/hooks/use-resumes";
import { ResumePreview } from "@/components/ResumePreview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Printer, 
  Download, 
  Plus, 
  Trash2, 
  Palette, 
  LayoutTemplate, 
  Eye, 
  PenTool,
  Save,
  CheckCircle2,
  Wand2,
  Loader2,
  Upload,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useImproveText } from "@/hooks/use-ai";
import { cn } from "@/lib/utils";
import html2pdf from 'html2pdf.js';

// Default data for immediate preview
const defaultResumeData: ResumeData = {
  templateId: "modern",
  color: "#2563eb",
  personalInfo: {
    fullName: "Ana Silva",
    email: "ana.silva@exemplo.com.br",
    phone: "(11) 98765-4321",
    location: "São Paulo, SP",
    linkedin: "linkedin.com/in/anasilva",
    website: "anasilva.dev"
  },
  objective: "Desenvolvedora Frontend apaixonada por criar interfaces intuitivas e acessíveis. Especialista em React e ecossistema moderno de JavaScript, com foco em performance e experiência do usuário.",
  experience: [
    {
      company: "Tech Solutions Brasil",
      position: "Desenvolvedora Senior",
      startDate: "2021",
      current: true,
      description: "Liderança técnica de equipe frontend, migração de legado para Next.js e implementação de Design System."
    },
    {
      company: "Agência Digital Web",
      position: "Desenvolvedora Pleno",
      startDate: "2019",
      endDate: "2021",
      current: false,
      description: "Desenvolvimento de landing pages de alta conversão e e-commerces utilizando React e VTEX."
    }
  ],
  education: [
    {
      institution: "Universidade de São Paulo",
      degree: "Bacharelado em Ciência da Computação",
      startDate: "2015",
      endDate: "2019"
    }
  ],
  skills: [
    { name: "React / Next.js", level: "Avançado" },
    { name: "TypeScript", level: "Avançado" },
    { name: "Tailwind CSS", level: "Fluente" },
    { name: "Node.js", level: "Intermediário" },
    { name: "Inglês", level: "Avançado" }
  ]
};

export default function Home() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("editor");
  const [scale, setScale] = useState(0.8);
  const previewRef = useRef<HTMLDivElement>(null);
  const improveTextMutation = useImproveText();
  
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeDataSchema),
    defaultValues: defaultResumeData,
    mode: "onChange"
  });

  const handleImproveText = async (fieldName: string) => {
    const currentValue = form.getValues(fieldName);
    if (!currentValue || typeof currentValue !== "string") return;

    try {
      const improved = await improveTextMutation.mutateAsync(currentValue);
      form.setValue(fieldName, improved);
      toast({
        title: "Texto melhorado!",
        description: "Sua IA ajudou a refinar o conteúdo.",
      });
    } catch (error) {
      // Error is already handled in mutation
    }
  };

  const { control, watch, register } = form;
  const formData = watch(); // Watch all changes for real-time preview

  // Field Arrays for dynamic lists
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: "experience"
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: "education"
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "skills"
  });

  // Calculate preview scale based on window width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setScale(0.85);
      else if (width >= 1024) setScale(0.65);
      else setScale(0.5); // Mobile preview scale
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;
    
    // Toast notification
    toast({
      title: "Gerando PDF...",
      description: "Seu currículo está sendo preparado para download.",
    });

    const opt = {
      margin: 0,
      filename: `curriculo-${formData.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore - html2pdf types are loose
      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: "Sucesso!",
        description: "Download iniciado com sucesso.",
        variant: "default",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF. Tente usar a opção de impressão.",
        variant: "destructive",
      });
    }
  };

  const createResume = useCreateResume();
  const onSave = async () => {
    try {
      await createResume.mutateAsync({
        title: `Currículo de ${formData.personalInfo.fullName}`,
        content: formData
      });
      toast({
        title: "Salvo com sucesso!",
        description: "Seu currículo foi salvo no banco de dados.",
        action: <CheckCircle2 className="w-5 h-5 text-green-500" />
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao tentar salvar seu currículo.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hidden sm:block">
            CV Generator
          </h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden sm:flex gap-2 text-slate-600 hover:text-primary"
            onClick={onSave}
            disabled={createResume.isPending}
          >
            <Save className="w-4 h-4" />
            {createResume.isPending ? "Salvando..." : "Salvar"}
          </Button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary font-medium"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
          
          <Button 
            size="sm" 
            className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            onClick={handleDownloadPDF}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Baixar PDF</span>
          </Button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Mobile Tabs */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor" className="flex gap-2">
                <PenTool className="w-4 h-4" /> Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex gap-2">
                <Eye className="w-4 h-4" /> Visualizar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* LEFT COLUMN: EDITOR */}
        <div className={cn(
          "flex-1 overflow-y-auto custom-scrollbar bg-white p-4 sm:p-6 lg:p-8 lg:max-w-xl xl:max-w-2xl border-r border-slate-200 shadow-xl z-10",
          activeTab === 'preview' ? 'hidden lg:block' : 'block'
        )}>
          <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Editor de Currículo</h2>
              <p className="text-slate-500">Preencha suas informações para gerar seu currículo profissional.</p>
            </div>

            {/* Customization Panel */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-6">
              <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                <Palette className="w-5 h-5 text-primary" />
                <h3>Personalização</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Modelo do Currículo</Label>
                  <Controller
                    control={control}
                    name="templateId"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Selecione um modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Moderno</SelectItem>
                          <SelectItem value="classic">Clássico (Serifa)</SelectItem>
                          <SelectItem value="minimal">Minimalista</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Cor de Destaque</Label>
                  <div className="flex items-center gap-3">
                    <Input 
                      type="color" 
                      {...register("color")} 
                      className="w-12 h-10 p-1 cursor-pointer" 
                    />
                    <div className="flex-1 text-xs text-slate-500">
                      Escolha uma cor profissional para destacar seções importantes.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Accordion */}
            <Accordion type="single" collapsible defaultValue="personal" className="w-full space-y-4">
              
              {/* Personal Info */}
              <AccordionItem value="personal" className="border border-slate-200 rounded-xl px-4 bg-white data-[state=open]:shadow-md transition-all">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <LayoutTemplate className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Dados Pessoais</div>
                      <div className="text-xs text-slate-500 font-normal">Nome, contato e localização</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome Completo</Label>
                      <Input {...register("personalInfo.fullName")} placeholder="Seu nome" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input {...register("personalInfo.email")} placeholder="seu.email@exemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input {...register("personalInfo.phone")} placeholder="(00) 00000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Localização</Label>
                      <Input {...register("personalInfo.location")} placeholder="Cidade, Estado" />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input {...register("personalInfo.linkedin")} placeholder="linkedin.com/in/..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Site / Portfólio</Label>
                      <Input {...register("personalInfo.website")} placeholder="seusite.com" />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label>Foto de Perfil</Label>
                    <div className="flex gap-4 items-start">
                      {formData.personalInfo.photo && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                          <img 
                            src={formData.personalInfo.photo} 
                            alt="Foto de perfil" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => form.setValue("personalInfo.photo", "")}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            type="button"
                            data-testid="button-remove-photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const result = event.target?.result as string;
                                form.setValue("personalInfo.photo", result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          id="photo-input"
                          data-testid="input-photo"
                        />
                        <label htmlFor="photo-input">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full cursor-pointer border-dashed"
                            onClick={() => document.getElementById("photo-input")?.click()}
                            asChild
                          >
                            <div className="flex gap-2 items-center justify-center">
                              <Upload className="w-4 h-4" />
                              Selecionar Foto
                            </div>
                          </Button>
                        </label>
                        <p className="text-xs text-slate-500 mt-1">JPG, PNG até 2MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between gap-2">
                      <Label>Objetivo Profissional</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs gap-1 text-slate-500 hover:text-primary"
                        onClick={() => handleImproveText("objective")}
                        disabled={improveTextMutation.isPending}
                        data-testid="button-improve-objective"
                      >
                        {improveTextMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Wand2 className="w-3 h-3" />
                        )}
                        {improveTextMutation.isPending ? "Melhorando..." : "Melhorar com IA"}
                      </Button>
                    </div>
                    <Textarea 
                      {...register("objective")} 
                      placeholder="Breve resumo sobre seus objetivos e qualificações..."
                      className="h-24 resize-none" 
                      data-testid="textarea-objective"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Experience */}
              <AccordionItem value="experience" className="border border-slate-200 rounded-xl px-4 bg-white data-[state=open]:shadow-md transition-all">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                      <PenTool className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Experiência Profissional</div>
                      <div className="text-xs text-slate-500 font-normal">Histórico de trabalho e cargos</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6">
                  <div className="space-y-6">
                    {expFields.map((field, index) => (
                      <div key={field.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative group">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExp(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label>Empresa</Label>
                            <Input {...register(`experience.${index}.company`)} placeholder="Nome da empresa" />
                          </div>
                          <div className="space-y-2">
                            <Label>Cargo</Label>
                            <Input {...register(`experience.${index}.position`)} placeholder="Seu cargo" />
                          </div>
                          <div className="space-y-2">
                            <Label>Início (Ano)</Label>
                            <Input {...register(`experience.${index}.startDate`)} placeholder="2020" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Fim (Ano)</Label>
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`current-${index}`} className="text-xs text-slate-500 cursor-pointer">Atualmente?</Label>
                                <Controller
                                  control={control}
                                  name={`experience.${index}.current`}
                                  render={({ field }) => (
                                    <Switch 
                                      id={`current-${index}`}
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <Input 
                              {...register(`experience.${index}.endDate`)} 
                              placeholder="2023" 
                              disabled={watch(`experience.${index}.current`)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <Label>Descrição das Atividades</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs gap-1 text-slate-500 hover:text-primary"
                              onClick={() => handleImproveText(`experience.${index}.description`)}
                              disabled={improveTextMutation.isPending}
                              data-testid={`button-improve-experience-${index}`}
                            >
                              {improveTextMutation.isPending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Wand2 className="w-3 h-3" />
                              )}
                              {improveTextMutation.isPending ? "Melhorando..." : "Melhorar com IA"}
                            </Button>
                          </div>
                          <Textarea 
                            {...register(`experience.${index}.description`)} 
                            placeholder="Descreva suas principais responsabilidades e conquistas..."
                            className="h-24 resize-none"
                            data-testid={`textarea-experience-description-${index}`}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-dashed border-slate-300 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5"
                      onClick={() => appendExp({ company: "", position: "", startDate: "" })}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Adicionar Experiência
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Education */}
              <AccordionItem value="education" className="border border-slate-200 rounded-xl px-4 bg-white data-[state=open]:shadow-md transition-all">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                      <LayoutTemplate className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Educação</div>
                      <div className="text-xs text-slate-500 font-normal">Formação acadêmica e cursos</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6">
                  <div className="space-y-6">
                    {eduFields.map((field, index) => (
                      <div key={field.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative group">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeEdu(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Instituição</Label>
                            <Input {...register(`education.${index}.institution`)} placeholder="Nome da universidade/escola" />
                          </div>
                          <div className="space-y-2">
                            <Label>Curso / Grau</Label>
                            <Input {...register(`education.${index}.degree`)} placeholder="Ex: Ciência da Computação" />
                          </div>
                          <div className="space-y-2">
                            <Label>Início (Ano)</Label>
                            <Input {...register(`education.${index}.startDate`)} placeholder="2016" />
                          </div>
                          <div className="space-y-2">
                            <Label>Fim (Ano)</Label>
                            <Input {...register(`education.${index}.endDate`)} placeholder="2020" />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-dashed border-slate-300 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5"
                      onClick={() => appendEdu({ institution: "", degree: "", startDate: "" })}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Adicionar Educação
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Skills */}
              <AccordionItem value="skills" className="border border-slate-200 rounded-xl px-4 bg-white data-[state=open]:shadow-md transition-all">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Habilidades</div>
                      <div className="text-xs text-slate-500 font-normal">Competências técnicas e idiomas</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6">
                  <div className="space-y-4">
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                          <Label className="text-xs text-slate-500">Habilidade</Label>
                          <Input {...register(`skills.${index}.name`)} placeholder="Ex: Inglês, Photoshop..." />
                        </div>
                        <div className="w-[140px] space-y-2">
                          <Label className="text-xs text-slate-500">Nível</Label>
                          <Controller
                            control={control}
                            name={`skills.${index}.level`}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Nível" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Básico">Básico</SelectItem>
                                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                                  <SelectItem value="Avançado">Avançado</SelectItem>
                                  <SelectItem value="Fluente">Fluente</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-red-500 mb-0.5"
                          onClick={() => removeSkill(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full border-dashed border-slate-300 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 mt-2"
                      onClick={() => appendSkill({ name: "", level: "Intermediário" })}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Adicionar Habilidade
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className={cn(
          "flex-1 bg-slate-100 lg:bg-slate-200/50 p-4 lg:p-8 flex items-start justify-center overflow-auto lg:overflow-hidden relative z-0",
          activeTab === 'editor' ? 'hidden lg:flex' : 'flex'
        )}>
          {/* Zoom Controls */}
          <div className="absolute bottom-8 right-8 z-50 bg-white shadow-lg rounded-full p-2 gap-4 hidden lg:flex items-center border border-slate-200">
            <span className="text-xs text-slate-500 font-medium pl-2">Zoom</span>
            <Slider 
              className="w-32" 
              defaultValue={[0.8]} 
              min={0.4} 
              max={1.2} 
              step={0.1} 
              value={[scale]}
              onValueChange={(val) => setScale(val[0])}
            />
          </div>

          <div className="relative shadow-2xl transition-all duration-300 ease-out print:shadow-none print:m-0 print:w-full">
             {/* This container needs a fixed size for the transform scale to work correctly without cutting off */}
            <div style={{ width: '210mm', height: '297mm' }}>
              <ResumePreview ref={previewRef} data={formData} scale={scale} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
