'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { ArrowLeft, Sparkles, CheckCircle, ArrowRight, Loader2, Upload, FileText, PenLine, Copy, ExternalLink, Zap, Clock, Globe, Edit3 } from 'lucide-react'
import PortfolioForm from '@/components/generator/PortfolioForm'
import { PortfolioData } from '@/types/portfolio'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface ParsedResumeData {
  name?: string
  title?: string
  email?: string
  subtitle?: string[]
  bio?: string
  socialLinks?: { platform: string; url: string }[]
  experiences?: { company: string; role: string; location: string; period: string }[]
  projects?: { title: string; description: string; technologies: string[]; github?: string; demo?: string }[]
  skills?: string[]
}

interface ExistingPortfolio {
  slug: string
  data: PortfolioData
  created_at: string
  updated_at: string
}

export default function GeneratorPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedData, setGeneratedData] = useState<PortfolioData | null>(null)
  const [existingPortfolio, setExistingPortfolio] = useState<ExistingPortfolio | null>(null)
  const [step, setStep] = useState<'loading' | 'existing' | 'method' | 'form'>('loading')
  const [prefillData, setPrefillData] = useState<ParsedResumeData | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Get username from Clerk
  const username = user?.username || user?.firstName?.toLowerCase().replace(/\s+/g, '') || ''

  // Check if user already has a portfolio
  useEffect(() => {
    async function checkExistingPortfolio() {
      if (!isLoaded || !isSignedIn) return

      try {
        const res = await fetch('/api/portfolio')
        const data = await res.json()

        if (data.portfolio) {
          setExistingPortfolio(data.portfolio)
          setStep('existing')
        } else {
          setStep('method')
        }
      } catch (err) {
        console.error('Failed to check portfolio:', err)
        setStep('method')
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded && isSignedIn) {
      checkExistingPortfolio()
    } else if (isLoaded && !isSignedIn) {
      setIsLoading(false)
    }
  }, [isLoaded, isSignedIn])

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processResumeFile(file)
  }

  const processResumeFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt']
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setIsParsing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to parse resume')
      }

      setPrefillData(result.data)
      setStep('form')
      setIsEditing(true)
      setIsEditMode(false)
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume')
    } finally {
      setIsParsing(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isParsing) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (isParsing) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      await processResumeFile(file)
    }
  }

  const handleManualFill = () => {
    setPrefillData(null)
    setStep('form')
    setIsEditing(true)
    setIsEditMode(false)
  }

  const handleEditExisting = () => {
    if (existingPortfolio) {
      // Pre-fill with existing portfolio data
      setGeneratedData(null)
      setStep('form')
      setIsEditing(true)
      setIsEditMode(true)
    }
  }

  const handleComplete = async (data: PortfolioData) => {
    setIsSaving(true)
    setError(null)

    try {
      const method = isEditMode ? 'PUT' : 'POST'
      const response = await fetch('/api/portfolio', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: data.slug,
          data: data
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save portfolio')
      }

      setGeneratedData(data)
      setIsEditing(false)
      setExistingPortfolio({ slug: data.slug, data, created_at: '', updated_at: '' })
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <main className="min-h-screen">
        <div className="fixed inset-0 -z-10 bg-muted/30" />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Not signed in - should not happen due to middleware, but handle anyway
  if (!isSignedIn) {
    return (
      <main className="min-h-screen">
        <div className="fixed inset-0 -z-10 bg-muted/30" />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Please sign in to create your portfolio.</p>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-muted/30" />

      <div className="container mx-auto px-4 py-8 pt-24">
        {generatedData ? (
          <div className="max-w-2xl mx-auto text-center animate-in fade-in duration-500">
            {/* Success animation */}
            <div className="relative mb-8">
              <div className="bg-primary p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-md">
                <CheckCircle className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              {isEditMode ? 'Portfolio Updated! 🎉' : 'Portfolio Live! 🎉'}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Your professional portfolio is now available at:
            </p>
            
            {/* URL Display */}
            <div className="relative group mb-8">
              <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                <code className="text-base md:text-lg font-mono text-primary truncate">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/p/{generatedData.slug}
                </code>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/p/${generatedData.slug}`)
                    alert('Link copied to clipboard!')
                  }}
                  className="flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="rounded-full">
                <Link href={`/p/${generatedData.slug}`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live Site
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full" 
                onClick={() => {
                  setGeneratedData(null)
                  setStep('existing')
                }}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Portfolio
              </Button>
            </div>

            {/* Next steps card */}
            <Card className="text-left bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  What's Next?
                </CardTitle>
                <CardDescription>Here are some ideas to maximize your portfolio's impact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Share on LinkedIn</p>
                    <p className="text-xs text-muted-foreground">Add your portfolio link to your LinkedIn profile</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Add to Resume</p>
                    <p className="text-xs text-muted-foreground">Include the link in your resume header</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : isEditing ? (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
               <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setStep(existingPortfolio ? 'existing' : 'method'); }} className="pl-0 hover:pl-2 transition-all group" disabled={isSaving}>
                 <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
               </Button>
            </div>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl mb-6 flex items-center gap-2">
                <span className="font-medium">Error:</span> <span>{error}</span>
              </div>
            )}
            <PortfolioForm 
              key={isEditMode ? 'edit-mode' : 'create-mode'}
              username={isEditMode && existingPortfolio ? existingPortfolio.slug : username} 
              onComplete={handleComplete} 
              isSubmitting={isSaving} 
              prefillData={isEditMode && existingPortfolio ? existingPortfolio.data : prefillData}
              isEditMode={isEditMode}
            />
          </div>
        ) : step === 'existing' ? (
          // User already has a portfolio - show options
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-foreground text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                Your Portfolio
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">You already have a portfolio!</h1>
              <p className="text-muted-foreground">
                Your portfolio is live at{' '}
                <Link href={`/p/${existingPortfolio?.slug}`} className="text-primary hover:underline font-medium">
                  /p/{existingPortfolio?.slug}
                </Link>
              </p>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-lg">{existingPortfolio?.data?.hero?.name || 'Your Portfolio'}</h3>
                    <p className="text-sm text-muted-foreground">{existingPortfolio?.data?.hero?.title}</p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/p/${existingPortfolio?.slug}`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button onClick={handleEditExisting} className="w-full" size="lg">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Portfolio
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/p/${existingPortfolio?.slug}`)
                      alert('Link copied to clipboard!')
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-sm text-muted-foreground">
              You can only have one portfolio per account. Edit your existing portfolio to make changes.
            </p>
          </div>
        ) : step === 'method' ? (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4 lg:mt-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-foreground text-sm font-medium mb-4">
                <Zap className="w-4 h-4 text-primary" />
                Create Portfolio
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">How would you like to build?</h1>
              <p className="text-muted-foreground">
                Your portfolio will be available at{' '}
                <span className="font-semibold text-primary">/p/{username}</span>
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl mb-6 flex items-center gap-2">
                <span className="font-medium">Error:</span> <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <label htmlFor="resume-upload">
                  <Card className={`cursor-pointer border-2 border-dashed transition-all duration-300 relative overflow-hidden group h-full ${isParsing ? 'pointer-events-none opacity-70' : ''} ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50'}`}>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleResumeUpload}
                      className="sr-only"
                      disabled={isParsing}
                    />
                    <CardContent className="pt-8 pb-8 text-center relative">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 ${isDragging ? 'bg-primary scale-110' : 'bg-primary'} text-primary-foreground`}>
                        {isParsing ? (
                          <Loader2 className="w-10 h-10 animate-spin" />
                        ) : (
                          <Upload className={`w-10 h-10 transition-transform duration-300 ${isDragging ? 'animate-bounce' : ''}`} />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {isDragging ? 'Drop your resume here' : 'Upload Resume'}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {isParsing ? 'AI is parsing your resume...' : isDragging ? 'Release to upload' : 'Drag & drop or click to upload'}
                      </p>
                      <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isDragging ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'}`}>
                        <FileText className="w-4 h-4" />
                        {isDragging ? 'Drop File' : 'Choose File'}
                      </div>
                      <p className="mt-4 text-xs text-muted-foreground">PDF, DOC, DOCX, or TXT (max 5MB)</p>
                    </CardContent>
                  </Card>
                </label>
              </div>

              <Card 
                className="cursor-pointer border hover:border-primary/50 transition-all duration-300 group h-full"
                onClick={handleManualFill}
              >
                <CardContent className="pt-8 pb-8 text-center relative">
                  <div className="w-20 h-20 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <PenLine className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fill Manually</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Enter your information step by step
                  </p>
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Start Writing
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">Full control over every field</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
