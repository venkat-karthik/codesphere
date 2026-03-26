"use client";

import { useState } from "react";
import { 
    FileText, 
    AlertTriangle, 
    CheckCircle2, 
    XCircle, 
    MoreVertical, 
    ShieldAlert,
    MessageSquare,
    Eye,
    Flag
} from "lucide-react";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle,
    CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockFlaggedContent = [
    { 
        id: "FLG-8821", 
        type: "post", 
        author: "User_992", 
        reason: "Hate speech", 
        content: "This is a mock offensive comment that needs moderation...", 
        status: "pending", 
        timestamp: "5 mins ago" 
    },
    { 
        id: "FLG-8822", 
        type: "comment", 
        author: "SpamBot42", 
        reason: "Spam/Link manipulation", 
        content: "Check out this amazing deal at bit.ly/spam-link", 
        status: "pending", 
        timestamp: "12 mins ago" 
    },
    { 
        id: "FLG-8823", 
        type: "community", 
        author: "DevRules", 
        reason: "Copyright violation", 
        content: "Uploading proprietary code snippets from X-Corp...", 
        status: "under_review", 
        timestamp: "1 hour ago" 
    },
];

export default function ContentControlPage() {
    const [activeTab, setActiveTab] = useState("flagged");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Content Control</h1>
                <p className="text-muted-foreground mt-1">
                    Review flagged items and maintain community standards.
                </p>
            </div>

            <Tabs defaultValue="flagged" className="w-full" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-card/40 border-border/40 p-1">
                        <TabsTrigger value="flagged" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                            <Flag className="w-4 h-4" />
                            Flagged Queue
                            <Badge className="ml-1 bg-red-500/20 text-red-400 border-red-500/20">{mockFlaggedContent.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="audit" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                            <FileText className="w-4 h-4" />
                            Audit Logs
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                            <ShieldAlert className="w-4 h-4" />
                            Filter Rules
                        </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">History</Button>
                        <Button variant="destructive" size="sm">Purge All Spam</Button>
                    </div>
                </div>

                <TabsContent value="flagged" className="mt-0">
                    <div className="grid gap-4">
                        {mockFlaggedContent.map((item) => (
                            <Card key={item.id} className="bg-card/40 border-border/40 hover:bg-card/60 transition-colors overflow-hidden group">
                                <CardContent className="p-0">
                                    <div className="flex items-stretch">
                                        <div className={`w-1 ${
                                            item.reason === 'Hate speech' ? 'bg-red-500' : 
                                            item.reason === 'Spam/Link manipulation' ? 'bg-orange-500' : 'bg-primary'
                                        }`} />
                                        <div className="flex-1 p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                                                        {item.type === 'post' ? <FileText className="w-5 h-5" /> : 
                                                         item.type === 'comment' ? <MessageSquare className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-sm">{item.author}</span>
                                                            <Badge variant="outline" className="text-[10px] h-4 py-0 uppercase">{item.type}</Badge>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                                                            {item.reason} • {item.timestamp}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 text-green-400 hover:text-green-300 hover:bg-green-500/20">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/20">
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="bg-background/40 border border-border/40 p-3 rounded-lg text-sm text-slate-300 leading-relaxed italic">
                                                "{item.content}"
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                
                <TabsContent value="audit" className="mt-0">
                    <Card className="bg-card/40 border-border/40 py-12">
                        <CardContent className="flex flex-col items-center justify-center text-center">
                            <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-semibold">Moderation Audit Logs</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                No recent moderation actions recorded. All actions taken by administrators will appear here for transparency.
                            </p>
                            <Button variant="outline" className="mt-6">Configure Logs</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                    <Card className="bg-card/40 border-border/40">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-primary" />
                                Automated Content Filtering
                            </CardTitle>
                            <CardDescription>
                                Configure the AI-driven system to automatically flag or hide potentially harmful content.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/50">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-medium">Spam Detection</div>
                                    <div className="text-xs text-muted-foreground">Auto-block known spam patterns and bot behavior.</div>
                                </div>
                                <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer shadow-inner">
                                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-background/50">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-medium">Profanity Filter</div>
                                    <div className="text-xs text-muted-foreground">Automatically censor or flag offensive language.</div>
                                </div>
                                <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer shadow-inner">
                                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
