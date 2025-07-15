"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CreditCard, AlertCircle, Shield, Lock } from "lucide-react"
import * as LDClient from "launchdarkly-js-client-sdk"
import { LD_CLIENT_ID } from "@/config/launchdarkly"

export default function PaymentScreen() {
  const [ldClient, setLdClient] = useState<LDClient.LDClient | null>(null)
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [flagStatus, setFlagStatus] = useState<string>("disconnected")

  useEffect(() => {
    // Initialize LaunchDarkly client
    const initializeLaunchDarkly = async () => {
      try {
        // Replace with your actual LaunchDarkly client-side ID
        const client = LDClient.initialize(LD_CLIENT_ID, {
          key: "user-key-123",
          name: "Test User",
          email: "test@example.com",
        })

        await client.waitForInitialization()
        setLdClient(client)
        setFlagStatus("connected")

        // Listen for flag changes
        client.on("change:new-payment-screen", (value: boolean) => {
          setShowError(value)
        })

        // Get initial flag value
        const initialValue = client.variation("new-payment-screen", false)
        setShowError(initialValue)
      } catch (error) {
        console.error("LaunchDarkly initialization failed:", error)
        setFlagStatus("error")
        // For demo purposes, we'll simulate the flag functionality
        // In a real app, you'd handle this error appropriately
        simulateFlag()
      }
    }

    // Simulate flag functionality for demo when LaunchDarkly isn't configured
    const simulateFlag = () => {
      setFlagStatus("simulated")
      // Toggle error state every 10 seconds for demo
      const interval = setInterval(() => {
        setShowError((prev) => !prev)
      }, 10000)
      return () => clearInterval(interval)
    }

    initializeLaunchDarkly()

    return () => {
      if (ldClient) {
        ldClient.close()
      }
    }
  }, [ldClient])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (showError) return

    setIsLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)
      alert("Payment processed successfully! (This is just a mock)")
    }, 2000)
  }

  const toggleFlag = () => {
    if (flagStatus === "simulated") {
      setShowError(!showError)
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ${
        showError ? "bg-gradient-to-br from-red-500 via-purple-600 to-pink-500" : "bg-gray-50"
      }`}
    >
      <div className="w-full max-w-md space-y-4">
        {/* LaunchDarkly Status Badge */}
        <div className="flex justify-center">
          <Badge
            variant={flagStatus === "connected" ? "default" : flagStatus === "simulated" ? "secondary" : "destructive"}
            className={`mb-4 transition-all duration-500 ${
              showError ? "bg-white/90 text-purple-800 shadow-lg scale-110" : ""
            }`}
          >
            LaunchDarkly: {flagStatus}
            {flagStatus === "simulated" && (
              <button onClick={toggleFlag} className="ml-2 text-xs underline">
                Toggle Flag
              </button>
            )}
          </Badge>
        </div>

        {/* Error State */}
        {showError && (
          <Alert variant="destructive" className="bg-white/90 backdrop-blur-sm border-white/20 shadow-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              🚨 Payment system is currently experiencing issues. Please try again later.
              <br />
              <span className="text-xs mt-1 block font-mono bg-red-100 px-2 py-1 rounded">
                Feature Flag: new-payment-screen = true
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Form */}
        <Card
          className={
            showError
              ? "opacity-50 pointer-events-none bg-white/80 backdrop-blur-sm shadow-2xl border-white/30"
              : "bg-white shadow-lg"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
            <CardDescription>Complete your purchase securely</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Card Information */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" maxLength={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" maxLength={4} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input id="cardName" placeholder="John Doe" />
              </div>

              {/* Billing Address */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Billing Address</h3>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Main Street" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="10001" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>$99.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>$8.00</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>$107.99</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading || showError}>
                {isLoading ? "Processing..." : "Complete Payment"}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Secured by SSL encryption</span>
                <Lock className="h-3 w-3" />
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Feature Flag Info */}
        <Card
          className={
            showError ? "bg-white/90 backdrop-blur-sm border-white/20 shadow-2xl" : "bg-blue-50 border-blue-200"
          }
        >
          <CardContent className="pt-4">
            <div className="text-sm space-y-2">
              <div className="font-medium text-blue-900">Feature Flag Status</div>
              <div className="text-blue-700">
                <strong>Flag:</strong> new-payment-screen
              </div>
              <div className="text-blue-700">
                <strong>Value:</strong> {showError ? "true" : "false"}
              </div>
              <div className="text-blue-700">
                <strong>Effect:</strong> {showError ? "Error state shown" : "Normal payment flow"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
