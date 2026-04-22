'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Input, Button } from '@/components/ui'

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      router.push('/')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className=" rounded-xl p-6 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold tracking-tight text-2xl">Update Password</h3>
          <p className="text-sm text-muted-foreground">
            Please enter your new password below.
          </p>
        </div>

        {/* Form Section */}
        <div className="pt-0">
          <form onSubmit={handleUpdatePassword}>
            <div className="flex flex-col gap-6">
              
              <Input
                id="password"
                label="New Password"
                type="password"
                placeholder="*****"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save new password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}