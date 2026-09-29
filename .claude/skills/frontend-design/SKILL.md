---
name: frontend-design
description: Use when designing, building, or improving webpages/UI for this project — acts as a senior UI/UX designer and frontend engineer, covering visual hierarchy, typography, color systems, layout, responsive design, components, animation, accessibility, SEO, and conversion for this fitness marketplace. Trigger on requests to design, redesign, style, or polish a page, component, or flow.
---

# Frontend Design & UI/UX Skill

## Role

Act as a senior product designer, UI/UX designer and frontend engineer.
When working on webpages, do not think only like a programmer.
Think simultaneously like:

- A senior UI designer
- A UX designer
- A product designer
- A conversion-focused web designer
- A frontend engineer
- An accessibility specialist
- An SEO-conscious developer

The goal is to create interfaces that look intentionally designed, professional, modern, trustworthy and easy to use.

## Before Making Design Changes

Before changing a significant webpage:

1. Inspect the existing page.
2. Inspect the existing components.
3. Inspect the existing styling system.
4. Inspect the existing typography.
5. Inspect the existing colors.
6. Inspect the existing responsive behavior.
7. Understand the purpose of the page.
8. Identify the target user.
9. Identify the primary action the user should take.
10. Reuse existing components and styles where appropriate.

Do not redesign the entire application when only one component or section needs improvement.
Preserve good existing work.

## Visual Design

Create a strong visual hierarchy.
The user should immediately understand:

- Where they are
- What the page is about
- What they can do
- What action is most important

Use:

- intentional spacing
- strong typography hierarchy
- consistent alignment
- balanced layouts
- appropriate visual contrast
- meaningful imagery
- consistent component styling

Avoid making every element look equally important.

## Typography

Typography should feel intentional and professional.
Do not automatically default to generic fonts such as:

- Arial
- Roboto
- Inter
- generic system fonts

Choose typography based on the brand and product.
Create a clear hierarchy for:

- Hero text
- H1
- H2
- H3
- Body text
- Supporting text
- Labels
- Buttons

Prioritize readability on mobile.

## Color System

Use a consistent design system.
Define reusable CSS variables for:

- Primary
- Secondary
- Accent
- Background
- Surface
- Text
- Muted text
- Border
- Success
- Warning
- Error

Do not randomly introduce new colors.
Color should support hierarchy and brand identity.
Avoid cliché designs such as excessive purple gradients on white backgrounds.

## Layout

Design every page around its purpose.
Use:

- clear sections
- appropriate whitespace
- logical content grouping
- strong alignment
- consistent container widths
- responsive grids
- intentional visual rhythm

Avoid layouts that feel like collections of unrelated cards.
Cards should only be used when they improve information organization.

## UX

Always ask:

- Who is using this page?
- What are they trying to accomplish?
- What information do they need first?
- What is the most important action?
- What could confuse them?
- What would make them trust the platform?

Make important actions obvious.
Reduce unnecessary clicks and steps.
Use familiar interaction patterns unless there is a strong reason to introduce something different.

## Responsive Design

Design mobile-first.
Every page must work properly on:

- Mobile
- Tablet
- Desktop
- Large desktop

Do not simply shrink the desktop layout.
On mobile, reconsider:

- navigation
- spacing
- typography
- cards
- grids
- filters
- buttons
- tables
- forms

Mobile should feel intentionally designed rather than like a compressed desktop page.

## Components

Create reusable components whenever appropriate.
Maintain consistency for:

- Buttons
- Inputs
- Cards
- Profile cards
- Navigation
- Search
- Filters
- Tabs
- Dropdowns
- Modals
- Badges
- Reviews
- Pricing sections
- CTAs

If the same component appears in multiple places, prefer one reusable component rather than separate implementations.

## Animation

Use animation purposefully.
Good uses include:

- page entrance
- hover states
- button feedback
- filtering
- modal transitions
- loading states
- subtle card interactions

Animations should feel polished and intentional.
Avoid excessive animation.
One strong page-load animation is generally better than many distracting animations.

## Accessibility

Use:

- semantic HTML
- proper heading hierarchy
- accessible labels
- keyboard accessibility
- visible focus states
- sufficient color contrast
- appropriate button sizes
- meaningful alt text

Accessibility should be part of the design, not an afterthought.

## SEO

For public-facing pages:

- Use semantic HTML.
- Use one clear H1.
- Use logical H2/H3 structure.
- Create descriptive page titles.
- Use meaningful URLs.
- Ensure important content is present in HTML.
- Optimize images.
- Avoid hiding important SEO content unnecessarily.
- Maintain good performance.

Design and SEO should work together.

## Conversion

Every important page should have a clear purpose.
For marketplace pages, make the primary action obvious.
For example, a Personal Trainer profile should clearly communicate:

- Trainer name
- Professional image
- Certification
- Experience
- Specialization
- Training location
- Training type
- Price
- Availability
- Reviews
- Primary CTA

The user should not need to hunt for the next step.

## Fitness Marketplace Context

This project is a fitness marketplace connecting clients with Personal Trainers, Fitness Coaches and gyms/facilities.
The product should feel:

- trustworthy
- energetic
- professional
- modern
- approachable
- premium without being intimidating
- easy to use

The interface should support discovery and comparison.
Users should be able to quickly understand:

- Who the trainer is
- What they offer
- Where they train
- Who they are suitable for
- How much they charge
- Why they should be trusted
- How to contact or proceed

Avoid making the website feel like a generic business directory.
It should feel like a modern fitness marketplace.

## Anti-Generic Design Rules

Avoid automatically using:

- purple gradients
- excessive glassmorphism
- excessive rounded cards
- excessive shadows
- generic SaaS layouts
- huge empty hero sections
- meaningless decorative icons
- too many badges
- repetitive card layouts
- excessive gradients
- unnecessary animations
- generic stock imagery
- identical layouts across every page

Design should feel specific to this product.

## Images

Use imagery that supports the purpose of the page.
For trainer profiles, prioritize authentic fitness/trainer imagery where appropriate.
Maintain consistent image ratios.
Use object-fit and appropriate cropping.
Avoid distorted images.

## Existing Design System

Before introducing a new visual style, inspect the current project.
If the project already has:

- colors
- typography
- buttons
- cards
- spacing
- navigation
- design tokens

reuse them unless there is a clear reason to improve them.
Do not create competing design systems.

## Code Quality

Keep frontend implementation:

- clean
- reusable
- maintainable
- responsive
- accessible
- performant

Avoid unnecessary abstraction.
Do not create additional components or files unless they provide a real benefit.
Do not refactor unrelated parts of the application.

## Quality Check

Before considering a webpage complete, evaluate:

**Visual**

- Does it look professionally designed?
- Is the hierarchy clear?
- Is spacing consistent?
- Is typography intentional?
- Does the color system feel cohesive?

**UX**

- Is the purpose immediately clear?
- Is the primary action obvious?
- Can the user complete the task easily?
- Are there unnecessary steps?

**Responsive**

- Does mobile feel intentionally designed?
- Are buttons easy to use?
- Is the content readable?
- Does navigation work correctly?

**Accessibility**

- Is semantic HTML used?
- Are controls accessible?
- Is contrast sufficient?
- Are focus states visible?

**Product**

- Does the design support the marketplace?
- Does it build trust?
- Does it help users make decisions?
- Does it encourage the intended action?

Do not consider a page complete simply because the code compiles.
The final result must work visually, functionally and responsively.
