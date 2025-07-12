/**
 * Design System Showcase Page
 * Demonstrates the enhanced BlackWoods Creative design system
 */

'use client';

import React from 'react';

import { Button, ButtonGroup, IconButton } from '@/components/ui/Button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardGrid,
  FeatureCard,
} from '@/components/ui/Card';

// Sample icons (using simple SVGs for demonstration)
const PlayIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
    />
  </svg>
);

const StarIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const HeartIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-500 py-16 text-white">
        <div className="container mx-auto px-6">
          <h1 className="mb-4 font-accent text-4xl font-bold md:text-6xl">BlackWoods Creative</h1>
          <p className="max-w-2xl font-secondary text-xl opacity-90 md:text-2xl">
            Enhanced Design System Showcase
          </p>
          <p className="mt-4 max-w-3xl text-lg opacity-80">
            Professional UI components with sophisticated styling, tasteful animations, and
            comprehensive design tokens.
          </p>
        </div>
      </div>

      <div className="container mx-auto space-y-16 px-6 py-16">
        {/* Typography Section */}
        <section>
          <h2 className="mb-8 font-primary text-3xl font-bold text-text-primary">
            Typography System
          </h2>
          <div className="space-y-6">
            <div>
              <h1 className="font-accent text-5xl font-bold text-text-primary">Display Heading</h1>
              <p className="mt-2 text-text-secondary">
                Playfair Display - For hero sections and major headings
              </p>
            </div>
            <div>
              <h2 className="font-primary text-3xl font-semibold text-text-primary">
                Primary Heading
              </h2>
              <p className="mt-2 text-text-secondary">
                Inter - For section headings and UI elements
              </p>
            </div>
            <div>
              <p className="font-secondary text-lg leading-relaxed text-text-secondary">
                Body text uses Crimson Text, an elegant serif font that provides excellent
                readability for longer content. This creates a sophisticated hierarchy that balances
                modern sans-serif headings with classic serif body text.
              </p>
            </div>
            <div>
              <code className="rounded bg-background-tertiary px-2 py-1 font-mono text-sm">
                JetBrains Mono - For code and technical content
              </code>
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section>
          <h2 className="mb-8 font-primary text-3xl font-bold text-text-primary">Color Palette</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="space-y-3">
              <div className="h-20 rounded-lg bg-primary-500 shadow-md" />
              <div>
                <h3 className="font-primary font-semibold text-text-primary">Primary</h3>
                <p className="text-sm text-text-secondary">Forest Green</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-20 rounded-lg bg-secondary-500 shadow-md" />
              <div>
                <h3 className="font-primary font-semibold text-text-primary">Secondary</h3>
                <p className="text-sm text-text-secondary">Warm Amber</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-20 rounded-lg bg-neutral-700 shadow-md" />
              <div>
                <h3 className="font-primary font-semibold text-text-primary">Neutral</h3>
                <p className="text-sm text-text-secondary">Warm Gray</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-20 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 shadow-md" />
              <div>
                <h3 className="font-primary font-semibold text-text-primary">Gradient</h3>
                <p className="text-sm text-text-secondary">Brand Blend</p>
              </div>
            </div>
          </div>
        </section>

        {/* Button Components */}
        <section>
          <h2 className="mb-8 font-primary text-3xl font-bold text-text-primary">
            Button Components
          </h2>

          <div className="space-y-8">
            {/* Button Variants */}
            <div>
              <h3 className="mb-4 font-primary text-xl font-semibold text-text-primary">
                Variants
              </h3>
              <ButtonGroup spacing="md">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </ButtonGroup>
            </div>

            {/* Button Sizes */}
            <div>
              <h3 className="mb-4 font-primary text-xl font-semibold text-text-primary">Sizes</h3>
              <ButtonGroup spacing="md">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </ButtonGroup>
            </div>

            {/* Button States */}
            <div>
              <h3 className="mb-4 font-primary text-xl font-semibold text-text-primary">States</h3>
              <ButtonGroup spacing="md">
                <Button leftIcon={<PlayIcon />}>With Icon</Button>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button elevated>Elevated</Button>
                <Button rounded>Rounded</Button>
              </ButtonGroup>
            </div>

            {/* Icon Buttons */}
            <div>
              <h3 className="mb-4 font-primary text-xl font-semibold text-text-primary">
                Icon Buttons
              </h3>
              <ButtonGroup spacing="md">
                <IconButton icon={<PlayIcon />} aria-label="Play" />
                <IconButton icon={<StarIcon />} aria-label="Favorite" variant="outline" />
                <IconButton icon={<HeartIcon />} aria-label="Like" variant="ghost" />
              </ButtonGroup>
            </div>
          </div>
        </section>

        {/* Card Components */}
        <section>
          <h2 className="mb-8 font-primary text-3xl font-bold text-text-primary">
            Card Components
          </h2>

          <CardGrid columns={3} gap="lg">
            <Card variant="default">
              <CardHeader title="Default Card" subtitle="Clean and minimal styling" />
              <CardContent>
                <p>This is the default card variant with subtle shadows and clean borders.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Learn More</Button>
              </CardFooter>
            </Card>

            <Card variant="elevated" interactive>
              <CardHeader title="Elevated Card" subtitle="Prominent with depth" />
              <CardContent>
                <p>This elevated card has more prominent shadows and interactive hover effects.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Explore
                </Button>
              </CardFooter>
            </Card>

            <Card variant="outlined">
              <CardHeader title="Outlined Card" subtitle="Subtle with border emphasis" />
              <CardContent>
                <p>This outlined card emphasizes the border with subtle hover effects.</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </CardFooter>
            </Card>

            <Card variant="filled">
              <CardHeader title="Filled Card" subtitle="Solid background styling" />
              <CardContent>
                <p>This filled card uses a solid background color for subtle differentiation.</p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader title="Glass Card" subtitle="Modern glassmorphism effect" />
              <CardContent>
                <p>This glass card features a modern glassmorphism effect with backdrop blur.</p>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardHeader title="Gradient Card" subtitle="Eye-catching gradient background" />
              <CardContent>
                <p>This gradient card uses brand colors for maximum visual impact.</p>
              </CardContent>
            </Card>
          </CardGrid>
        </section>

        {/* Feature Cards */}
        <section>
          <h2 className="mb-8 font-primary text-3xl font-bold text-text-primary">Feature Cards</h2>

          <CardGrid columns={3} gap="lg">
            <FeatureCard
              icon={<PlayIcon />}
              title="Video Production"
              description="Professional video production services with state-of-the-art equipment and creative expertise."
              action={
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              }
              variant="elevated"
              interactive
            />

            <FeatureCard
              icon={<StarIcon />}
              title="Photography"
              description="Stunning photography that captures the essence of your brand and tells your unique story."
              action={
                <Button size="sm" variant="outline">
                  View Portfolio
                </Button>
              }
              variant="elevated"
              interactive
            />

            <FeatureCard
              icon={<HeartIcon />}
              title="3D Visualization"
              description="Cutting-edge 3D visualization and animation services for architectural and product design."
              action={
                <Button size="sm" variant="outline">
                  Explore
                </Button>
              }
              variant="elevated"
              interactive
            />
          </CardGrid>
        </section>

        {/* Design Tokens */}
        <section>
          <h2 className="mb-8 font-primary text-3xl font-bold text-text-primary">Design Tokens</h2>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader title="Spacing Scale" />
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 bg-primary-500" />
                    <span className="font-mono text-sm">2px (0.5)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-4 bg-primary-500" />
                    <span className="font-mono text-sm">16px (4)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-6 bg-primary-500" />
                    <span className="font-mono text-sm">24px (6)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 bg-primary-500" />
                    <span className="font-mono text-sm">32px (8)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Border Radius" />
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-sm bg-primary-500" />
                    <span className="font-mono text-sm">4px (sm)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-md bg-primary-500" />
                    <span className="font-mono text-sm">6px (md)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-lg bg-primary-500" />
                    <span className="font-mono text-sm">8px (lg)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary-500" />
                    <span className="font-mono text-sm">full</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
