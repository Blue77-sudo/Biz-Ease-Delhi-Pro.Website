import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User,
  MessageCircle,
  Phone,
  Video,
  Clock,
  CheckCircle,
  Star,
  HelpCircle,
  GraduationCap,
  Briefcase,
  Scale
} from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { translations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

export default function ExpertPage() {
  const { user, language } = useAuthStore();
  const { toast } = useToast();
  const t = translations[language];

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      content: "Hello! I'm your expert consultant. How can I assist you today?",
      sender: 'expert',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [consultationForm, setConsultationForm] = useState({
    expertType: "",
    consultationType: "",
    subject: "",
    description: "",
    preferredTime: "",
    urgency: ""
  });

  const experts = [
    {
      id: "1",
      name: "Dr. Rajesh Kumar",
      designation: "Senior Legal Advisor",
      expertise: ["Business Law", "Compliance", "Contract Law"],
      experience: "15+ years",
      rating: 4.9,
      availability: "Available",
      avatar: "/placeholder-avatar.jpg",
      icon: Scale,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: "2",
      name: "CA Priya Sharma",
      designation: "Chartered Accountant",
      expertise: ["Tax Planning", "GST", "Financial Compliance"],
      experience: "12+ years",
      rating: 4.8,
      availability: "Busy until 3 PM",
      avatar: "/placeholder-avatar.jpg",
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      id: "3",
      name: "Prof. Ankit Verma",
      designation: "Business Strategy Consultant",
      expertise: ["Business Planning", "Market Analysis", "Growth Strategy"],
      experience: "10+ years",
      rating: 4.7,
      availability: "Available",
      avatar: "/placeholder-avatar.jpg",
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to get a Shop & Establishment License?",
      answer: "Typically, it takes 7-10 working days if all documents are in order. Our tracker provides predictive timelines based on current processing volumes.",
      category: "Licensing"
    },
    {
      question: "What are the eligibility criteria for MSME schemes?",
      answer: "Eligibility depends on investment in plant & machinery/equipment and annual turnover. Micro enterprises: up to ₹1 crore investment, Small: ₹1-10 crores, Medium: ₹10-50 crores. Our scheme recommender can provide personalized recommendations.",
      category: "Schemes"
    },
    {
      question: "How can I track my GST registration status?",
      answer: "You can track your GST registration through the GST portal using your application reference number (ARN). Alternatively, use our integrated tracking system for real-time updates.",
      category: "Tax"
    },
    {
      question: "What documents are required for factory license renewal?",
      answer: "Required documents include: Previous license copy, NOC from pollution board, fire safety certificate, building plan approval, and updated employee records.",
      category: "Licensing"
    }
  ];

  const consultationTypes = [
    { value: "legal", label: "Legal Consultation" },
    { value: "tax", label: "Tax Advisory" },
    { value: "business", label: "Business Strategy" },
    { value: "compliance", label: "Compliance Guidance" },
    { value: "licensing", label: "Licensing Support" }
  ];

  const expertTypes = [
    { value: "lawyer", label: "Legal Expert" },
    { value: "ca", label: "Chartered Accountant" },
    { value: "consultant", label: "Business Consultant" },
    { value: "compliance", label: "Compliance Officer" }
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      content: chatInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput("");

    // Simulate expert response
    setTimeout(() => {
      const expertResponse = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for your question. Let me provide you with detailed guidance on this matter. Based on your query, I recommend following the specific procedures outlined in the latest Delhi government guidelines.",
        sender: 'expert',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, expertResponse]);
    }, 1500);
  };

  const handleBookConsultation = () => {
    if (!consultationForm.expertType || !consultationForm.consultationType || !consultationForm.subject) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Consultation request submitted successfully! Our expert will contact you within 24 hours.",
    });

    setIsConsultationOpen(false);
    setConsultationForm({
      expertType: "",
      consultationType: "",
      subject: "",
      description: "",
      preferredTime: "",
      urgency: ""
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask an Expert</h1>
        <p className="text-gray-600">Connect with legal, tax, and business advisory experts for personalized guidance on your business needs.</p>
      </div>

      {/* Expert Services Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Available Experts</span>
            </CardTitle>
            <CardDescription>
              Our panel of verified experts ready to assist you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {experts.map((expert) => {
              const Icon = expert.icon;
              return (
                <div key={expert.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${expert.bgColor} rounded-full flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${expert.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{expert.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{expert.designation}</p>
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{expert.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600">{expert.experience}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {expert.expertise.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${expert.availability === "Available" ? "bg-green-500" : "bg-yellow-500"}`}></div>
                          <span className="text-sm text-gray-600">{expert.availability}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setIsChatOpen(true)}>
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm" onClick={() => setIsConsultationOpen(true)}>
                        <Video className="h-4 w-4 mr-1" />
                        Book Call
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={() => setIsChatOpen(true)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setIsConsultationOpen(true)}>
                <Phone className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full">
                <Video className="h-4 w-4 mr-2" />
                Video Consultation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Live Chat</span>
                <span className="text-sm font-medium text-green-600">&lt; 2 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phone Call</span>
                <span className="text-sm font-medium text-blue-600">&lt; 24 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Query</span>
                <span className="text-sm font-medium text-purple-600">&lt; 4 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
          <CardDescription>
            Find quick answers to common business licensing and compliance questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Licensing">Licensing</TabsTrigger>
              <TabsTrigger value="Tax">Tax</TabsTrigger>
              <TabsTrigger value="Schemes">Schemes</TabsTrigger>
              <TabsTrigger value="Compliance">Compliance</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-6">
              {faqs.map((faq, index) => (
                <details key={index} className="border border-gray-200 rounded-lg p-4">
                  <summary className="font-medium cursor-pointer flex items-center justify-between">
                    <span>{faq.question}</span>
                    <Badge variant="outline" className="ml-2">{faq.category}</Badge>
                  </summary>
                  <p className="text-gray-600 text-sm mt-3 pl-4">{faq.answer}</p>
                </details>
              ))}
            </TabsContent>
            {["Licensing", "Tax", "Schemes", "Compliance"].map(category => (
              <TabsContent key={category} value={category} className="space-y-4 mt-6">
                {faqs.filter(faq => faq.category === category).map((faq, index) => (
                  <details key={index} className="border border-gray-200 rounded-lg p-4">
                    <summary className="font-medium cursor-pointer">{faq.question}</summary>
                    <p className="text-gray-600 text-sm mt-3 pl-4">{faq.answer}</p>
                  </details>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Live Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-md h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Live Chat with Expert</span>
            </DialogTitle>
            <DialogDescription>
              You're connected with a business expert. Ask your questions below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'chat-bubble-user bg-blue-100 text-gray-900' 
                    : 'chat-bubble-ai bg-blue-600 text-white'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your question..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Book Consultation Dialog */}
      <Dialog open={isConsultationOpen} onOpenChange={setIsConsultationOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Book Expert Consultation</DialogTitle>
            <DialogDescription>
              Schedule a personalized consultation with our experts
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expert Type</Label>
                <Select 
                  value={consultationForm.expertType} 
                  onValueChange={(value) => setConsultationForm(prev => ({ ...prev, expertType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expert" />
                  </SelectTrigger>
                  <SelectContent>
                    {expertTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Consultation Type</Label>
                <Select 
                  value={consultationForm.consultationType} 
                  onValueChange={(value) => setConsultationForm(prev => ({ ...prev, consultationType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Subject</Label>
              <Input
                value={consultationForm.subject}
                onChange={(e) => setConsultationForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief subject of consultation"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={consultationForm.description}
                onChange={(e) => setConsultationForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your query or requirement in detail"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Preferred Time</Label>
                <Input
                  type="datetime-local"
                  value={consultationForm.preferredTime}
                  onChange={(e) => setConsultationForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Urgency</Label>
                <Select 
                  value={consultationForm.urgency} 
                  onValueChange={(value) => setConsultationForm(prev => ({ ...prev, urgency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsConsultationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookConsultation}>
              Book Consultation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
