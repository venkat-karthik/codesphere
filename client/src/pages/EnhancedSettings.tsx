import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Keyboard, 
  Download, 
  Trash2,
  Save,
  Eye,
  EyeOff,
  Camera,
  CreditCard,
  Settings,
  Monitor,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
  Zap,
  Star,
  Code,
  Zap as Lightning,
  Leaf,
  Waves,
  Sunset,
  SquareDot,
  Sparkles,
  Minus
} from 'lucide-react';

export function EnhancedSettings() {
  const { theme, setTheme } = useTheme();
  const { isAdmin } = useUserRole();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
  });

  // Sync profile state when user loads
  useEffect(() => {
    if (user) {
      setProfile(p => ({
        ...p,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio || '',
      }));
    }
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user || user.id <= 0) throw new Error('Demo accounts cannot save profile');
      const res = await apiRequest('PATCH', `/api/users/${user.id}`, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        bio: profile.bio,
      });
      return res.json();
    },
    onSuccess: (data) => {
      updateUser({ firstName: data.firstName, lastName: data.lastName, bio: data.bio });
      toast({ title: 'Profile saved', description: 'Your profile has been updated.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (passwordForm.newPass !== passwordForm.confirm) throw new Error('Passwords do not match');
      if (passwordForm.newPass.length < 6) throw new Error('Password must be at least 6 characters');
      const res = await apiRequest('POST', '/api/auth/change-password', {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.newPass,
      });
      return res.json();
    },
    onSuccess: () => {
      setPasswordForm({ current: '', newPass: '', confirm: '' });
      setPasswordError('');
      toast({ title: 'Password changed', description: 'Your password has been updated.' });
    },
    onError: (err: any) => {
      setPasswordError(err.message);
    },
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    codeTheme: 'dark',
    fontSize: 'medium',
    autoSave: true,
    showLineNumbers: true,
    wordWrap: true,
    minimap: true,
    soundEffects: true,
    animations: true,
    compactMode: false
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = (user as any)?.preferences?.notifications;
    return saved || {
      emailNotifications: true, pushNotifications: true, desktopNotifications: true,
      weeklyDigest: true, courseUpdates: true, communityMessages: true,
      achievementAlerts: true, reminderNotifications: true, marketingEmails: false,
    };
  });

  const [privacy, setPrivacy] = useState(() => {
    const saved = (user as any)?.preferences?.privacy;
    return saved || {
      profileVisibility: 'public', showProgress: true, showAchievements: true,
      showActivity: true, allowDirectMessages: true, showOnlineStatus: true, dataCollection: true,
    };
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 'auto',
    loginAlerts: true,
    passwordLastChanged: '2024-01-15',
    activeSessions: 3
  });

  const handleSaveProfile = () => {
    saveProfileMutation.mutate();
  };

  const handleSavePreferences = () => {
    // Preferences (theme) are already saved via ThemeContext on change
    toast({ title: 'Preferences saved' });
  };

  const handleSaveNotifications = () => {
    if (!user) return;
    apiRequest('PATCH', `/api/users/${user.id}`, {
      preferences: {
        ...(user as any).preferences,
        notifications,
      },
    }).then(() => toast({ title: 'Notification settings saved' }))
      .catch(() => toast({ title: 'Failed to save', variant: 'destructive' }));
  };

  const handleSavePrivacy = () => {
    if (!user) return;
    apiRequest('PATCH', `/api/users/${user.id}`, {
      preferences: {
        ...(user as any).preferences,
        privacy,
      },
    }).then(() => toast({ title: 'Privacy settings saved' }))
      .catch(() => toast({ title: 'Failed to save', variant: 'destructive' }));
  };

  const handleSaveSecurity = () => {
    if (passwordForm.current) {
      changePasswordMutation.mutate();
    } else {
      toast({ title: 'Security settings saved' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Customize your CodeSphere experience
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shrink-0">
                  {user?.profileImage
                    ? <img src={user.profileImage} alt="avatar" className="w-full h-full object-cover" />
                    : `${profile.firstName[0] || '?'}${profile.lastName[0] || ''}`}
                </div>
                <div className="space-y-2">
                  <label className="cursor-pointer">
                    <Button size="sm" asChild>
                      <span><Camera className="mr-2 h-4 w-4" />Change Photo</span>
                    </Button>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !user || user.id <= 0) return;
                        const reader = new FileReader();
                        reader.onload = async (ev) => {
                          const dataUrl = ev.target?.result as string;
                          const [header, base64] = dataUrl.split(',');
                          const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
                          try {
                            const res = await fetch(`/api/users/${user.id}/avatar`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({ imageData: base64, mimeType }),
                            });
                            const data = await res.json();
                            if (res.ok) {
                              updateUser({ profileImage: data.profileImage } as any);
                              toast({ title: 'Profile photo updated' });
                            } else {
                              toast({ title: 'Error', description: data.message, variant: 'destructive' });
                            }
                          } catch {
                            toast({ title: 'Upload failed', variant: 'destructive' });
                          }
                        };
                        reader.readAsDataURL(file);
                      }} />
                  </label>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WebP or GIF. Max 2MB.</p>
                  {user && user.id <= 0 && <p className="text-xs text-muted-foreground">Demo accounts cannot upload photos.</p>}
                </div>
              </div>

              <Separator />

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="font-semibold">Social Links</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      placeholder="username"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="username"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      placeholder="username"
                      value={profile.twitter}
                      onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  Save Profile Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>General</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="Europe/London">GMT</SelectItem>
                      <SelectItem value="Europe/Paris">CET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Appearance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setTheme('light')}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                    >
                      <Sun className="h-5 w-5" />
                      <span className="text-xs">Light</span>
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setTheme('dark')}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                    >
                      <Moon className="h-5 w-5" />
                      <span className="text-xs">Dark</span>
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      onClick={() => setTheme('system' as any)}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                    >
                      <Monitor className="h-5 w-5" />
                      <span className="text-xs">System</span>
                    </Button>
                    <Button
                      variant={theme === 'star-trek' ? 'default' : 'outline'}
                      onClick={() => setTheme('star-trek' as any)}
                      className="flex flex-col items-center space-y-2 h-auto py-4 glow"
                    >
                      <Star className="h-5 w-5" />
                      <span className="text-xs">Star Trek</span>
                    </Button>
                    <Button
                      variant={theme === 'coding-vibe' ? 'default' : 'outline'}
                      onClick={() => setTheme('coding-vibe' as any)}
                      className="flex flex-col items-center space-y-2 h-auto py-4 terminal-glow"
                    >
                      <Code className="h-5 w-5" />
                      <span className="text-xs">Coding Vibe</span>
                    </Button>
                    <Button
                      variant={theme === 'cyberpunk' ? 'default' : 'outline'}
                      onClick={() => setTheme('cyberpunk' as any)}
                      className="flex flex-col items-center space-y-2 h-auto py-4 neon-glow"
                    >
                      <Lightning className="h-5 w-5" />
                      <span className="text-xs">Cyberpunk</span>
                    </Button>
                    <Button
                      variant={theme === 'nature' ? 'default' : 'outline'}
                      onClick={() => setTheme('nature' as any)}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                    >
                      <Leaf className="h-5 w-5" />
                      <span className="text-xs">Nature</span>
                    </Button>
                    <Button
                      variant={theme === 'ocean' ? 'default' : 'outline'}
                      onClick={() => setTheme('ocean' as any)}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                    >
                      <Waves className="h-5 w-5" />
                      <span className="text-xs">Ocean</span>
                    </Button>
                    <Button
                      variant={theme === 'sunset' ? 'default' : 'outline'}
                      onClick={() => setTheme('sunset' as any)}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                    >
                      <Sunset className="h-5 w-5" />
                      <span className="text-xs">Sunset</span>
                    </Button>
                    <Button
                      variant={theme === 'matrix' ? 'default' : 'outline'}
                      onClick={() => setTheme('matrix' as any)}
                      className="flex flex-col items-center space-y-2 h-auto py-4 matrix-glow"
                    >
                      <SquareDot className="h-5 w-5" />
                      <span className="text-xs">Matrix</span>
                    </Button>
                    <Button
                      variant={theme === 'retro' ? 'default' : 'outline'}
                      onClick={() => setTheme('retro' as any)}
                      className="flex flex-col items-center space-y-2 h-auto py-4 retro-glow"
                    >
                      <Sparkles className="h-5 w-5" />
                      <span className="text-xs">Retro</span>
                    </Button>
                    <Button
                      variant={theme === 'minimal' ? 'default' : 'outline'}
                      onClick={() => setTheme('minimal' as any)}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                    >
                      <Minus className="h-5 w-5" />
                      <span className="text-xs">Minimal</span>
                    </Button>
                  </div>
                  
                  {/* Theme Descriptions */}
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Theme Descriptions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Star Trek:</strong> Futuristic blue and gold theme inspired by the iconic sci-fi series
                      </div>
                      <div>
                        <strong>Coding Vibe:</strong> Classic terminal green on black for that authentic hacker feel
                      </div>
                      <div>
                        <strong>Cyberpunk:</strong> Neon cyan and purple with high contrast for a dystopian future look
                      </div>
                      <div>
                        <strong>Nature:</strong> Warm earth tones with forest green accents for a natural feel
                      </div>
                      <div>
                        <strong>Ocean:</strong> Deep blue tones with turquoise highlights like the deep sea
                      </div>
                      <div>
                        <strong>Sunset:</strong> Warm orange and amber gradients inspired by golden hour
                      </div>
                      <div>
                        <strong>Matrix:</strong> Pure black with bright green text for that digital rain effect
                      </div>
                      <div>
                        <strong>Retro:</strong> Bright 80s-inspired colors with yellow and pink accents
                      </div>
                      <div>
                        <strong>Minimal:</strong> Clean black and white design for maximum focus
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select value={preferences.fontSize} onValueChange={(value) => setPreferences({ ...preferences, fontSize: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animations">Animations</Label>
                    <Switch
                      id="animations"
                      checked={preferences.animations}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, animations: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="soundEffects">Sound Effects</Label>
                    <Switch
                      id="soundEffects"
                      checked={preferences.soundEffects}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, soundEffects: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="compactMode">Compact Mode</Label>
                    <Switch
                      id="compactMode"
                      checked={preferences.compactMode}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, compactMode: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Keyboard className="h-5 w-5" />
                  <span>Code Editor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Editor Theme</Label>
                  <Select value={preferences.codeTheme} onValueChange={(value) => setPreferences({ ...preferences, codeTheme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vs-dark">VS Dark</SelectItem>
                      <SelectItem value="vs-light">VS Light</SelectItem>
                      <SelectItem value="hc-black">High Contrast</SelectItem>
                      <SelectItem value="monokai">Monokai</SelectItem>
                      <SelectItem value="solarized-dark">Solarized Dark</SelectItem>
                      <SelectItem value="solarized-light">Solarized Light</SelectItem>
                      <SelectItem value="dracula">Dracula</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                      {/* Add more custom themes here in the future */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoSave">Auto Save</Label>
                    <Switch
                      id="autoSave"
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, autoSave: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showLineNumbers">Line Numbers</Label>
                    <Switch
                      id="showLineNumbers"
                      checked={preferences.showLineNumbers}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, showLineNumbers: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="wordWrap">Word Wrap</Label>
                    <Switch
                      id="wordWrap"
                      checked={preferences.wordWrap}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, wordWrap: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="minimap">Minimap</Label>
                    <Switch
                      id="minimap"
                      checked={preferences.minimap}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, minimap: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Theme Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Preview how your selected theme looks with sample content:
                  </p>
                  
                  {/* Live Theme Preview */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Sample Card</h4>
                      <Button size="sm" variant="outline">
                        Action
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This is how text and interactive elements will appear in your selected theme.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Primary</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm">Primary</Button>
                      <Button size="sm" variant="secondary">Secondary</Button>
                      <Button size="sm" variant="outline">Outline</Button>
                    </div>
                  </div>
                  
                  {/* Theme Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <h5 className="font-medium">Current Theme Features:</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        {theme === 'star-trek' && (
                          <>
                            <li>• Futuristic blue and gold color scheme</li>
                            <li>• Glowing effects on interactive elements</li>
                            <li>• Inspired by Star Trek's Enterprise bridge</li>
                          </>
                        )}
                        {theme === 'coding-vibe' && (
                          <>
                            <li>• Classic terminal green on black</li>
                            <li>• Authentic hacker aesthetic</li>
                            <li>• Terminal-style glow effects</li>
                          </>
                        )}
                        {theme === 'cyberpunk' && (
                          <>
                            <li>• Neon cyan and purple highlights</li>
                            <li>• High contrast dystopian future look</li>
                            <li>• Neon glow effects on elements</li>
                          </>
                        )}
                        {theme === 'nature' && (
                          <>
                            <li>• Warm earth tones and forest greens</li>
                            <li>• Natural, calming color palette</li>
                            <li>• Organic, nature-inspired design</li>
                          </>
                        )}
                        {theme === 'ocean' && (
                          <>
                            <li>• Deep blue tones with turquoise accents</li>
                            <li>• Underwater-inspired color scheme</li>
                            <li>• Calming oceanic atmosphere</li>
                          </>
                        )}
                        {theme === 'sunset' && (
                          <>
                            <li>• Warm orange and amber gradients</li>
                            <li>• Golden hour inspired colors</li>
                            <li>• Cozy, warm atmosphere</li>
                          </>
                        )}
                        {theme === 'matrix' && (
                          <>
                            <li>• Pure black with bright green text</li>
                            <li>• Digital rain effect</li>
                          </>
                        )}
                        {theme === 'retro' && (
                          <>
                            <li>• Bright 80s-inspired colors</li>
                            <li>• Yellow and pink neon accents</li>
                            <li>• Vintage retro gaming aesthetic</li>
                          </>
                        )}
                        {theme === 'minimal' && (
                          <>
                            <li>• Clean black and white design</li>
                            <li>• Maximum focus and clarity</li>
                            <li>• Minimalist aesthetic</li>
                          </>
                        )}
                        {(theme === 'light' || theme === 'dark') && (
                          <>
                            <li>• Standard light/dark theme</li>
                            <li>• Clean and professional look</li>
                            <li>• Familiar interface design</li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium">Theme Tips:</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Themes automatically save to your preferences</li>
                        <li>• Each theme has unique visual effects</li>
                        <li>• Some themes work better in different lighting</li>
                        <li>• You can switch themes anytime from the top bar</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Communication</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <Label htmlFor="desktopNotifications">Desktop Notifications</Label>
                      </div>
                      <Switch
                        id="desktopNotifications"
                        checked={notifications.desktopNotifications}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, desktopNotifications: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Content Updates</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="courseUpdates">Course Updates</Label>
                      <Switch
                        id="courseUpdates"
                        checked={notifications.courseUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, courseUpdates: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="communityMessages">Community Messages</Label>
                      <Switch
                        id="communityMessages"
                        checked={notifications.communityMessages}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, communityMessages: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="achievementAlerts">Achievement Alerts</Label>
                      <Switch
                        id="achievementAlerts"
                        checked={notifications.achievementAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, achievementAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="reminderNotifications">Study Reminders</Label>
                      <Switch
                        id="reminderNotifications"
                        checked={notifications.reminderNotifications}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, reminderNotifications: checked })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Email Preferences</h4>
                <div className="flex items-center justify-between">
                  <Label htmlFor="weeklyDigest">Weekly Progress Digest</Label>
                  <Switch
                    id="weeklyDigest"
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <Switch
                    id="marketingEmails"
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy & Visibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Show on Profile</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showProgress">Learning Progress</Label>
                    <Switch
                      id="showProgress"
                      checked={privacy.showProgress}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showProgress: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showAchievements">Achievements</Label>
                    <Switch
                      id="showAchievements"
                      checked={privacy.showAchievements}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showAchievements: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showActivity">Recent Activity</Label>
                    <Switch
                      id="showActivity"
                      checked={privacy.showActivity}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showActivity: checked })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">Communication</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowDirectMessages">Allow Direct Messages</Label>
                    <Switch
                      id="allowDirectMessages"
                      checked={privacy.allowDirectMessages}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, allowDirectMessages: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showOnlineStatus">Show Online Status</Label>
                    <Switch
                      id="showOnlineStatus"
                      checked={privacy.showOnlineStatus}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showOnlineStatus: checked })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">Data Collection</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="dataCollection">Analytics & Improvements</Label>
                      <p className="text-xs text-muted-foreground">Help us improve CodeSphere with anonymous usage data</p>
                    </div>
                    <Switch
                      id="dataCollection"
                      checked={privacy.dataCollection}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, dataCollection: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePrivacy}>
                  Save Privacy Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Change Password</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" value={passwordForm.current}
                    onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                    placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" value={passwordForm.newPass}
                    onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
                    placeholder="At least 6 characters" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" value={passwordForm.confirm}
                    onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                    placeholder="Repeat new password" />
                </div>
                {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                {user && user.id <= 0 && (
                  <p className="text-xs text-muted-foreground">Demo accounts cannot change password.</p>
                )}
                <Button
                  onClick={() => changePasswordMutation.mutate()}
                  disabled={!passwordForm.current || !passwordForm.newPass || changePasswordMutation.isPending || (user?.id ?? 0) <= 0}
                >
                  {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Account Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Disabled</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security (coming soon)</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>Enable</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout</Label>
                  <Select value={security.sessionTimeout} onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15min">15 minutes</SelectItem>
                      <SelectItem value="1hour">1 hour</SelectItem>
                      <SelectItem value="8hours">8 hours</SelectItem>
                      <SelectItem value="auto">Automatic</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="loginAlerts">Login Alerts</Label>
                  <Switch
                    id="loginAlerts"
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Current Session</p>
                        <p className="text-xs text-muted-foreground">Chrome on Windows</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Mobile App</p>
                        <p className="text-xs text-muted-foreground">iOS • 2 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Another Browser</p>
                        <p className="text-xs text-muted-foreground">Firefox on Mac • 1 week ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>

                <Button variant="destructive" className="w-full">
                  Revoke All Other Sessions
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSecurity}>
              Save Security Settings
            </Button>
          </div>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Current Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-2 border-primary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Pro Plan</h3>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Next billing date: February 15, 2024
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Plan Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Unlimited access to all courses</li>
                    <li>• Premium AI mentor support</li>
                    <li>• Advanced code sandbox</li>
                    <li>• Priority community support</li>
                    <li>• Downloadable resources</li>
                    <li>• Certificate of completion</li>
                  </ul>
                </div>

                <div className="space-x-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="destructive">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-8 w-8" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/26</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>

                <Button className="w-full">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">$29.00</p>
                      <p className="text-sm text-muted-foreground">January 15, 2024</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Invoice
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">$29.00</p>
                      <p className="text-sm text-muted-foreground">December 15, 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Invoice
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">$29.00</p>
                      <p className="text-sm text-muted-foreground">November 15, 2023</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Monthly Credits</span>
                      <span>750 / 1000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>AI Mentor Sessions</span>
                      <span>42 / 100</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sandbox Runtime</span>
                      <span>18.5 / 50 hours</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '37%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}