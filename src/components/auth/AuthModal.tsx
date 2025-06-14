
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, User, Phone, Home, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

const AuthModal = ({ isOpen, onClose, mode, onModeChange }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    caretakerPhone: '',
    displayPhonePreference: 'owner' as 'owner' | 'caretaker',
    role: 'tenant' as 'tenant' | 'landlord'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(loginForm.email, loginForm.password);
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      onClose();
      // Reset form
      setLoginForm({ email: '', password: '' });
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Make phone number mandatory for landlords
    if (registerForm.role === 'landlord' && !registerForm.phone.trim()) {
      setError('Phone number is required for landlords');
      setIsLoading(false);
      return;
    }

    // If caretaker phone is provided but display preference is caretaker, validate caretaker phone
    if (registerForm.role === 'landlord' && registerForm.displayPhonePreference === 'caretaker' && !registerForm.caretakerPhone.trim()) {
      setError('Caretaker phone number is required when set as display preference');
      setIsLoading(false);
      return;
    }

    const result = await register({
      email: registerForm.email,
      password: registerForm.password,
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      phone: registerForm.phone,
      caretakerPhone: registerForm.caretakerPhone,
      displayPhonePreference: registerForm.displayPhonePreference,
      role: registerForm.role
    });

    if (result.success) {
      toast({
        title: "Welcome to RentKenya!",
        description: "Your account has been created successfully.",
      });
      onClose();
      // Reset form
      setRegisterForm({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        caretakerPhone: '',
        displayPhonePreference: 'owner',
        role: 'tenant'
      });
    } else {
      setError(result.error || 'Registration failed');
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Join RentKenya'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Create your account and start finding your perfect home'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(value) => onModeChange(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={registerForm.firstName}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">I am a</Label>
                    <Select 
                      value={registerForm.role} 
                      onValueChange={(value: 'tenant' | 'landlord') => 
                        setRegisterForm(prev => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tenant">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Tenant (Looking for a house)
                          </div>
                        </SelectItem>
                        <SelectItem value="landlord">
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-2" />
                            Landlord (Renting out property)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number {registerForm.role === 'landlord' && <span className="text-red-500">*</span>}
                      {registerForm.role === 'tenant' && <span className="text-gray-500">(Optional)</span>}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="pl-10"
                        required={registerForm.role === 'landlord'}
                      />
                    </div>
                    {registerForm.role === 'landlord' && (
                      <p className="text-sm text-gray-600">
                        Phone number is required for landlords to enable tenant contact
                      </p>
                    )}
                  </div>

                  {registerForm.role === 'landlord' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="caretakerPhone">
                          Caretaker Phone Number <span className="text-gray-500">(Optional)</span>
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="caretakerPhone"
                            type="tel"
                            placeholder="+254 700 000 000"
                            value={registerForm.caretakerPhone}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, caretakerPhone: e.target.value }))}
                            className="pl-10"
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          Add a caretaker's contact number for property management
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Which number should tenants call?</Label>
                        <RadioGroup 
                          value={registerForm.displayPhonePreference} 
                          onValueChange={(value: 'owner' | 'caretaker') => 
                            setRegisterForm(prev => ({ ...prev, displayPhonePreference: value }))
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="owner" id="owner" />
                            <Label htmlFor="owner">My phone number</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value="caretaker" 
                              id="caretaker" 
                              disabled={!registerForm.caretakerPhone.trim()}
                            />
                            <Label htmlFor="caretaker" className={!registerForm.caretakerPhone.trim() ? 'text-gray-400' : ''}>
                              Caretaker's phone number
                              {!registerForm.caretakerPhone.trim() && <span className="text-sm"> (Enter caretaker number first)</span>}
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
