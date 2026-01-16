import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/types'
import { Loader2, Upload, FileText, Check, User } from 'lucide-react'

export function ProfilePage() {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [userId, setUserId] = useState('')
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        full_name: '',
        email: '',
        phone: '',
        linkedin_url: '',
        resume_url: '',
    })

    useEffect(() => {
        // Get guest ID
        const id = localStorage.getItem('job_scraper_guest_id')
        if (id) {
            setUserId(id)
            fetchProfile(id)
        }
    }, [])

    const fetchProfile = async (uid: string) => {
        setLoading(true)
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', uid)
            .single()
        
        if (data) {
            setProfile(data)
        }
        setLoading(false)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        
        setUploading(true)
        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}-${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        try {
            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('resumes')
                .getPublicUrl(filePath)

            setProfile(prev => ({ ...prev, resume_url: publicUrl }))
        } catch (error) {
            console.error('Error uploading resume:', error)
            alert('Failed to upload resume')
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async () => {
        if (!userId) return
        setLoading(true)

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    user_id: userId,
                    ...profile,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' })

            if (error) throw error
            alert('Profile saved! You can now use Auto-Apply.')
        } catch (error) {
            console.error('Error saving profile:', error)
            alert('Failed to save profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
                <p className="text-muted-foreground mt-2">
                    Set up your profile and resume to enable AI Auto-Apply.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Personal Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>
                            This information will be used to fill out job applications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input 
                                    id="fullName" 
                                    placeholder="John Doe"
                                    value={profile.full_name}
                                    onChange={e => setProfile({...profile, full_name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="john@example.com"
                                    value={profile.email}
                                    onChange={e => setProfile({...profile, email: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input 
                                    id="phone" 
                                    placeholder="+60 12 345 6789"
                                    value={profile.phone}
                                    onChange={e => setProfile({...profile, phone: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn URL</Label>
                                <Input 
                                    id="linkedin" 
                                    placeholder="https://linkedin.com/in/john"
                                    value={profile.linkedin_url}
                                    onChange={e => setProfile({...profile, linkedin_url: e.target.value})}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resume Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Resume
                        </CardTitle>
                        <CardDescription>
                            Upload your resume (PDF). The AI will use this to extract details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <Input 
                                    type="file" 
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="cursor-pointer"
                                />
                            </div>
                            {uploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                        </div>
                        
                        {profile.resume_url && (
                            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-600 text-sm">
                                <Check className="h-4 w-4" />
                                Resume uploaded successfully
                                <a href={profile.resume_url} target="_blank" className="underline ml-1">View</a>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button size="lg" onClick={handleSave} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Profile'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
