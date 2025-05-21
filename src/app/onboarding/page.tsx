import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

export default function OnboardingPage() {
  async function handleOnboarding(formData: FormData) {
    "use server";
    // Mock onboarding - in real app, this would save user preferences
    const companyName = formData.get("companyName") as string;
    const industry = formData.get("industry") as string;

    if (companyName && industry) {
      // Mock successful onboarding
      redirect("/connect");
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[500px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome to PulsePilot</CardTitle>
          <CardDescription>Let&apos;s get your account set up</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleOnboarding} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Acme Inc."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" name="industry" type="text" placeholder="Technology" required />
            </div>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
