// app/(user)/apply-for-contributor-access/page.tsx
'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, CheckCircle, Upload, Plus, X, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FormData {
  fullName: string;
  email: string;
  portfolio: string;
  experience: string;
  bio: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  contributorTermsAccepted: boolean;
  fontName: string;
  fontDescription: string;
  fontStyles: {
    name: string;
    file: File | null;
  }[];
  personalLicense: string;
  commercialLicense: string;
  previewImage: File | null;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  portfolio?: string;
  experience?: string;
  bio?: string;
  terms?: string;
  fontName?: string;
  fontDescription?: string;
  fontStyles?: string;
  personalLicense?: string;
  commercialLicense?: string;
  previewImage?: string;
}

const ContributorApplication = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    portfolio: '',
    experience: '',
    bio: '',
    termsAccepted: false,
    privacyAccepted: false,
    contributorTermsAccepted: false,
    fontName: '',
    fontDescription: '',
    fontStyles: [{ name: 'Regular', file: null }],
    personalLicense: '',
    commercialLicense: '',
    previewImage: null
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};

    if (currentStep === 1) {
      
      if (!formData.bio.trim()) {
        newErrors.bio = 'Bio is required';
      }
      if (formData.portfolio && formData.portfolio.trim() && !/^https?:\/\/.+/.test(formData.portfolio)) {
        newErrors.portfolio = 'Please enter a valid URL starting with http:// or https://';
      }
    }

    if (currentStep === 2) {
      if (!formData.termsAccepted || !formData.privacyAccepted || !formData.contributorTermsAccepted) {
        newErrors.terms = 'You must accept all terms to continue';
      }
    }

    if (currentStep === 3) {
      if (!formData.fontName.trim()) {
        newErrors.fontName = 'Font name is required';
      }
      if (!formData.fontDescription.trim()) {
        newErrors.fontDescription = 'Font description is required';
      }
      if (!formData.fontStyles.some(style => style.file)) {
        newErrors.fontStyles = 'At least one font file is required';
      }
      if (!formData.personalLicense.trim()) {
        newErrors.personalLicense = 'Personal license price is required';
      }
      if (!formData.commercialLicense.trim()) {
        newErrors.commercialLicense = 'Commercial license price is required';
      }
      if (!formData.previewImage) {
        newErrors.previewImage = 'Preview image is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name: 'termsAccepted' | 'privacyAccepted' | 'contributorTermsAccepted') => 
    (checked: boolean) => {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      if (errors.terms) {
        setErrors(prev => ({ ...prev, terms: '' }));
      }
    };



  const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newStyles = [...formData.fontStyles];
      newStyles[index] = {
        ...newStyles[index],
        file: e.target.files[0]
      };
      setFormData(prev => ({
        ...prev,
        fontStyles: newStyles
      }));
    }
  };

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        previewImage: file
      }));
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      return () => URL.revokeObjectURL(url);
    }
  };

  const addFontStyle = () => {
    setFormData(prev => ({
      ...prev,
      fontStyles: [...prev.fontStyles, { name: '', file: null }]
    }));
  };

  const removeFontStyle = (index: number) => {
    if (formData.fontStyles.length > 1) {
      setFormData(prev => ({
        ...prev,
        fontStyles: prev.fontStyles.filter((_, i) => i !== index)
      }));
    }
  };

  const handleStyleNameChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStyles = [...formData.fontStyles];
    newStyles[index] = {
      ...newStyles[index],
      name: e.target.value
    };
    setFormData(prev => ({
      ...prev,
      fontStyles: newStyles
    }));
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep(step)) {
      console.log('Form submitted:', formData);
      setStep(prev => prev + 1);
    }
  };

  const renderError = (fieldName: keyof FormErrors) => {
    if (errors[fieldName]) {
      return (
        <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
          <AlertCircle className="h-4 w-4" />
          <span>{errors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
        </div>
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="relative flex flex-col items-center z-10 bg-white">
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200'
              )}
            >
              {num}
            </div>
            <div className="text-xs mt-2 text-gray-600">
              {num === 1 ? 'Profile' : 
               num === 2 ? 'Terms' :
               num === 3 ? 'Font' : 'Complete'}
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {step === 1 && 'Create Your Profile'}
            {step === 2 && 'Accept Terms & Conditions'}
            {step === 3 && 'Submit Your First Font'}
            {step === 4 && 'Application Submitted'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Profile Information */}
            {step === 1 && (
              <div className="space-y-4">
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and your font design journey"
                    className={errors.bio ? 'border-red-500' : ''}
                    rows={4}
                  />
                  {renderError('bio')}
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio URL (Optional)</Label>
                  <Input
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://your-portfolio.com"
                    className={errors.portfolio ? 'border-red-500' : ''}
                  />
                  {renderError('portfolio')}
                </div>
                <div>
                  <Label htmlFor="experience">Experience (Optional)</Label>
                  <Textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Describe your experience in font design"
                    className={errors.experience ? 'border-red-500' : ''}
                    rows={3}
                  />
                  {renderError('experience')}
                </div>
              </div>
            )}

            {/* Step 2: Terms & Conditions */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Terms of Service
                    </h3>
                    <ScrollArea className="h-48 w-full rounded border bg-white p-4">
                      <div className="text-sm space-y-4">
                        <p>By accepting these terms, you agree to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Submit only original fonts that you have created</li>
                          <li>Grant us non-exclusive rights to distribute your fonts</li>
                          <li>Accept our revenue sharing model</li>
                          <li>Maintain quality standards for all submissions</li>
                          <li>Respond to customer inquiries in a timely manner</li>
                          <li>Keep your font files and documentation up to date</li>
                          <li>Comply with our content guidelines</li>
                        </ul>
                      </div>
                    </ScrollArea>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={handleCheckboxChange('termsAccepted')}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I accept the Terms of Service
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Privacy Policy
                    </h3>
                    <ScrollArea className="h-48 w-full rounded border bg-white p-4">
                      <div className="text-sm space-y-4">
                        <p>We are committed to protecting your privacy:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>We collect only necessary personal information</li>
                          <li>Your data is securely stored and encrypted</li>
                          <li>We never share your information without consent</li>
                          <li>You can request data deletion at any time</li>
                          <li>We use industry-standard security measures</li>
                          <li>We maintain transparent data practices</li>
                        </ul>
                      </div>
                    </ScrollArea>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={formData.privacyAccepted}
                        onCheckedChange={handleCheckboxChange('privacyAccepted')}
                      />
                      <Label htmlFor="privacy" className="text-sm">
                        I accept the Privacy Policy
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Contributor Agreement
                    </h3>
                    <ScrollArea className="h-48 w-full rounded border bg-white p-4">
                      <div className="text-sm space-y-4">
                        <p>As a contributor, you agree to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Provide accurate information about your fonts</li>
                          <li>Set fair and competitive prices</li>
                          <li>Respond to support requests within 48 hours</li>
                          <li>Maintain font updates and fix reported issues</li>
                          <li>Follow our content guidelines and best practices</li>
                          <li>Participate in the community responsibly</li>
                          <li>Maintain professional communication</li>
                        </ul>
                      </div>
                    </ScrollArea>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="contributorTerms"
                        checked={formData.contributorTermsAccepted}
                        onCheckedChange={handleCheckboxChange('contributorTermsAccepted')}
                      />
                      <Label htmlFor="contributorTerms" className="text-sm">
                        I accept the Contributor Agreement
                      </Label>
                    </div>
                  </div>
                </div>
                {errors.terms && (
                  <div className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.terms}</span>
                  </div>
                )}
              </div>
            )}

{/* Step 3: Font Submission */}
{step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="fontName">Font Name</Label>
                  <Input
                    id="fontName"
                    name="fontName"
                    value={formData.fontName}
                    onChange={handleInputChange}
                    placeholder="Enter your font name"
                    className={errors.fontName ? 'border-red-500' : ''}
                  />
                  {renderError('fontName')}
                </div>

                <div>
                  <Label htmlFor="fontDescription">Font Description</Label>
                  <Textarea
                    id="fontDescription"
                    name="fontDescription"
                    value={formData.fontDescription}
                    onChange={handleInputChange}
                    placeholder="Describe your font's features and ideal use cases"
                    rows={4}
                    className={errors.fontDescription ? 'border-red-500' : ''}
                  />
                  {renderError('fontDescription')}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Font Styles</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addFontStyle}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Style
                    </Button>
                  </div>
                  
                  {formData.fontStyles.map((style, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Style {index + 1}</h4>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFontStyle(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <Input
                        placeholder="Style name (e.g., Regular, Bold)"
                        value={style.name}
                        onChange={handleStyleNameChange(index)}
                        className="mb-2"
                      />
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".otf,.ttf,.woff,.woff2"
                          onChange={handleFileChange(index)}
                          className="flex-1"
                        />
                        {style.file && (
                          <span className="text-sm text-green-600">
                            ✓ Uploaded
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {renderError('fontStyles')}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="personalLicense">Personal License Price ($)</Label>
                    <Input
                      id="personalLicense"
                      name="personalLicense"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.personalLicense}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className={errors.personalLicense ? 'border-red-500' : ''}
                    />
                    {renderError('personalLicense')}
                  </div>

                  <div>
                    <Label htmlFor="commercialLicense">Commercial License Price ($)</Label>
                    <Input
                      id="commercialLicense"
                      name="commercialLicense"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.commercialLicense}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className={errors.commercialLicense ? 'border-red-500' : ''}
                    />
                    {renderError('commercialLicense')}
                  </div>
                </div>

                <div>
                  <Label>Preview Image</Label>
                  <div className="mt-2 space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {previewUrl ? (
                        <div className="space-y-4">
                          <img 
                            src={previewUrl} 
                            alt="Font Preview" 
                            className="max-h-48 mx-auto"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setPreviewUrl('');
                              setFormData(prev => ({ ...prev, previewImage: null }));
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <label
                            htmlFor="previewImage"
                            className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                          >
                            Upload preview image
                            <Input
                              id="previewImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePreviewImageChange}
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Recommended size: 1200x630px (PNG, JPG)
                          </p>
                        </div>
                      )}
                    </div>
                    {renderError('previewImage')}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Completion */}
            {step === 4 && (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Application Submitted Successfully!
                </h3>
                <p className="text-gray-600 mb-4">
                  Thank you for applying to be a contributor. We&apos;ll review your application and get back to you within 2-3 business days.
                </p>
                <Alert>
                  <AlertDescription>
                    Application Reference: APP-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                <Button 
                  type={step === 3 ? "submit" : "button"}
                  onClick={step < 3 ? handleNext : undefined}
                  disabled={step === 2 && (!formData.termsAccepted || !formData.privacyAccepted || !formData.contributorTermsAccepted)}
                  className={cn("ml-auto", step === 1 && "w-full")}
                >
                  {step === 3 ? 'Submit Application' : 'Continue'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContributorApplication;