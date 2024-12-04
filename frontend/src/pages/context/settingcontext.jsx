import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const SettingsContext = createContext(null)

export const useSettingsContext = () => {
    const context = useContext(SettingsContext)
    if (!context) throw new Error('useSettingsContext must be used within SettingsProvider')
    return context
}

export const SettingsProvider = ({ children }) => {
    const API_URL = import.meta.env.VITE_API_URL
    const API_KEY = import.meta.env.VITE_API_KEY
    const token = localStorage.getItem('access_token')

    const [settings, setSettings] = useState({
        title: "",
        description: "",
        timezone: "",
        language: "",
        logoUrl: "",
        favicon: "",
        primaryColor: "",
        secondaryColor: "",
        metaTitle: "",
        metaDescription: "",
        googleAnalyticsId: "",
        facebookPixelId: "",
        email: "",
        phone: "",
        address: "",
        workingHours: "",
        bannerUrl: "",
        defaultThumbnail: "",
        maxUploadSize: 5,
        allowedFileTypes: [],
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        youtube: "",
        apiKey: "",
        webhookUrl: "",
        allowedOrigins: "*",
        rateLimit: 100
    })
    const [loading, setLoading] = useState(true)

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/settings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-api-secret': API_KEY
                }
            })
            if (!response.ok) throw new Error('Failed to fetch settings')
            const data = await response.json()

            setSettings({
                title: data.title,
                description: data.description,
                timezone: data.timezone,
                language: data.language,
                logoUrl: data.logo_url,
                favicon: data.favicon,
                primaryColor: data.primary_color,
                secondaryColor: data.secondary_color,
                metaTitle: data.meta_title,
                metaDescription: data.meta_description,
                googleAnalyticsId: data.google_analytics_id,
                facebookPixelId: data.facebook_pixel_id,
                email: data.contact_email,
                phone: data.phone,
                address: data.address,
                workingHours: data.working_hours,
                bannerUrl: data.banner_url,
                defaultThumbnail: data.default_thumbnail,
                maxUploadSize: data.max_upload_size,
                allowedFileTypes: JSON.parse(data.allowed_file_types || '[]'),
                facebook: data.facebook_url,
                twitter: data.twitter_url,
                instagram: data.instagram_url,
                linkedin: data.linkedin_url,
                youtube: data.youtube_url,
                apiKey: data.api_key,
                webhookUrl: data.webhook_url,
                allowedOrigins: data.allowed_origins,
                rateLimit: data.rate_limit
            })
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            const apiData = {
                title: settings.title,
                description: settings.description,
                timezone: settings.timezone,
                language: settings.language,
                logo_url: settings.logoUrl,
                favicon: settings.favicon,
                primary_color: settings.primaryColor,
                secondary_color: settings.secondaryColor,
                meta_title: settings.metaTitle,
                meta_description: settings.metaDescription,
                google_analytics_id: settings.googleAnalyticsId,
                facebook_pixel_id: settings.facebookPixelId,
                contact_email: settings.email,
                phone: settings.phone,
                address: settings.address,
                working_hours: settings.workingHours,
                banner_url: settings.bannerUrl,
                default_thumbnail: settings.defaultThumbnail,
                max_upload_size: settings.maxUploadSize,
                allowed_file_types: JSON.stringify(settings.allowedFileTypes),
                facebook_url: settings.facebook,
                twitter_url: settings.twitter,
                instagram_url: settings.instagram,
                linkedin_url: settings.linkedin,
                youtube_url: settings.youtube,
                api_key: settings.apiKey,
                webhook_url: settings.webhookUrl,
                allowed_origins: settings.allowedOrigins,
                rate_limit: settings.rateLimit
            }

            await fetch(`${API_URL}/admin/settings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-api-secret': API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiData)
            })

            toast.success('Settings saved successfully')
        } catch (error) {
            toast.error('Error saving settings')
        }
    }
    useEffect(() => {
        fetchSettings()
    }, []) 


    return (
        <SettingsContext.Provider value={{
            settings,
            setSettings,
            loading,
            fetchSettings,
            handleSave
        }}>
            {children}
        </SettingsContext.Provider>
    )
}