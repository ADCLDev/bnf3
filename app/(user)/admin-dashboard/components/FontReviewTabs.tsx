import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, ExternalLink } from 'lucide-react';

// Mock data for both contributor and font submissions
const contributorSubmissions = [
  {
    id: 'CONT-001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    bio: 'Passionate type designer with a focus on Bengali typography. Graduate in Visual Communication.',
    portfolio: 'https://portfolio.johndoe.com',
    experience: '5+ years in type design',
    submittedDate: '2024-12-14',
    status: 'pending',
    termsAccepted: true,
    submittedFont: {
      name: 'Elegance Sans',
      styles: ['Regular', 'Bold'],
      preview: '/api/placeholder/400/200',
      sampleText: 'The quick brown fox jumps over the lazy dog',
      technicalRequirements: true,
      characterSetComplete: true,
      qualityStandards: true
    }
  },
  {
    id: 'CONT-002',
    name: 'Sarah Smith',
    email: 'sarah.smith@email.com',
    bio: 'Typography enthusiast specializing in modern Bengali fonts. Self-taught designer with a passion for cultural preservation.',
    portfolio: '',
    experience: '',
    submittedDate: '2024-12-13',
    status: 'pending',
    termsAccepted: true,
    submittedFont: {
      name: 'Vintage Display',
      styles: ['Regular'],
      preview: '/api/placeholder/400/200',
      sampleText: 'The quick brown fox jumps over the lazy dog',
      technicalRequirements: true,
      characterSetComplete: false,
      qualityStandards: true
    }
  }
];

const fontSubmissions = [
  {
    id: 'FONT-001',
    name: 'Modern Script Pro',
    creator: 'John Doe',
    submittedDate: '2024-12-14',
    status: 'pending',
    styles: ['Regular', 'Bold', 'Italic'],
    sampleText: 'The quick brown fox jumps over the lazy dog',
    technicalRequirements: true,
    characterSetComplete: true,
    licenseTermsValid: true,
    qualityStandards: false,
    preview: '/api/placeholder/400/200'
  },
  {
    id: 'FONT-002',
    name: 'Clean Sans',
    creator: 'Jane Smith',
    submittedDate: '2024-12-13',
    status: 'pending',
    styles: ['Regular'],
    sampleText: 'The quick brown fox jumps over the lazy dog',
    technicalRequirements: true,
    characterSetComplete: false,
    licenseTermsValid: true,
    qualityStandards: true,
    preview: '/api/placeholder/400/200'
  }
];

const FontReviewTabs = () => {
  const handleApprove = (id: string, type: 'contributor' | 'font') => {
    console.log(`Approving ${type}:`, id);
  };

  const handleReject = (id: string, type: 'contributor' | 'font') => {
    console.log(`Rejecting ${type}:`, id);
  };

  const handleAddFeedback = (id: string, type: 'contributor' | 'font') => {
    console.log(`Adding feedback for ${type}:`, id);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Font Review</h2>
      
      <Tabs defaultValue="contributors" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="contributors">Contributor Approval</TabsTrigger>
          <TabsTrigger value="fonts">Font Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="contributors" className="space-y-6">
          {contributorSubmissions.map(submission => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{submission.name}</CardTitle>
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Pending Review
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Contributor Details</h4>
                      <p className="mt-2 text-sm text-gray-600">{submission.bio}</p>
                      <div className="mt-4 space-y-2">
                        <p>Email: {submission.email}</p>
                        <p>Submitted: {submission.submittedDate}</p>
                        {submission.portfolio && (
                          <p className="flex items-center gap-2">
                            Portfolio: 
                            <a 
                              href={submission.portfolio} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                            >
                              View <ExternalLink className="h-4 w-4" />
                            </a>
                          </p>
                        )}
                        {submission.experience && (
                          <p>Experience: {submission.experience}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Requirements Check</h4>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${submission.submittedFont.technicalRequirements ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>Technical Requirements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${submission.submittedFont.characterSetComplete ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>Character Set Complete</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${submission.submittedFont.qualityStandards ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>Quality Standards Met</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${submission.termsAccepted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>Terms Accepted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Submitted Font: {submission.submittedFont.name}</h4>
                      <p className="text-sm text-gray-600">Styles: {submission.submittedFont.styles.join(', ')}</p>
                    </div>
                    <img src={submission.submittedFont.preview} alt="Font Preview" className="w-full rounded-lg" />
                    <p className="font-mono text-sm">{submission.submittedFont.sampleText}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApprove(submission.id, 'contributor')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(submission.id, 'contributor')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAddFeedback(submission.id, 'contributor')}
                        className="px-4 py-2 border rounded hover:bg-gray-50"
                      >
                        Add Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="fonts" className="space-y-6">
          {fontSubmissions.map(submission => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{submission.name}</CardTitle>
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Pending Review
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Submission Details</h4>
                      <p>Creator: {submission.creator}</p>
                      <p>Submitted: {submission.submittedDate}</p>
                      <p>Styles: {submission.styles.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Requirements Check</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${submission.technicalRequirements ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>Technical Requirements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${submission.characterSetComplete ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>Character Set Complete</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${submission.licenseTermsValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>License Terms Valid</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${submission.qualityStandards ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>Quality Standards Met</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <img src={submission.preview} alt="Font Preview" className="w-full rounded-lg" />
                    <p className="font-mono text-sm">{submission.sampleText}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApprove(submission.id, 'font')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(submission.id, 'font')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAddFeedback(submission.id, 'font')}
                        className="px-4 py-2 border rounded hover:bg-gray-50"
                      >
                        Add Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FontReviewTabs;