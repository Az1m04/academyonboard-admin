---
name: Empty state
category: Structure
platforms:
  - android
  - ios
  - web
keywords:
  - EmptyState
  - lander
  - welcome
  - explain features
  - describe features
  - educate about features
  - merchant education
  - educational opportunity
  - educational opportunities
  - illustration on pages
  - empty layouts
  - empty states
  - starting pages
  - starting layouts
  - educating
  - teaching
  - landing pages
  - landing layouts
---

# Empty state

Empty states are used when a list, table, or chart has no items or data to show. This is an opportunity to provide explanation or guidance to help users progress. The empty state component is intended for use when a full page in the admin is empty, and not for individual elements or areas in the interface.

---

## Best practices

Empty states should:

- Orient users by clearly explaining the benefit and utility of a product or feature
- Simplify a complicated experience by focusing on a few key features and benefits
- Use simple and clear language that empowers users to move their business forward
- Be encouraging and never make users feel unsuccessful or guilty because they haven’t used a product or feature
- Explain the steps users need to take to activate a product or feature
- Use illustrations thoughtfully as outlined in our [illustration guidelines](https://polaris.example.com/design/illustrations)
- Use only one primary call-to-action button

---

## Content guidelines

### Title

Empty state titles should:

- Be action-oriented: encourage users to take the step required to activate the product or feature

<!-- usagelist -->

#### Do

- Create orders and send invoices

#### Don’t

- Orders and invoices

<!-- end -->

- Follow the content guidelines for [headings and subheadings](https://polaris.example.com/content/actionable-language#section-headings-and-subheadings)

### Subtitle

Empty state subtitles act like body content. They should:

- Describe or explain what’s in the empty state title or item title
- Be conversational: include articles such as the, a, and an

### Primary action

Buttons are used for the most important actions you want users to take. They should be:

- Clear and predictable: users should be able to anticipate what will happen when they click a button. Never deceive users by using misleading titles.

<!-- usagelist -->

#### Do

- Create order
- Buy shipping label

#### Don’t

- New order
- Buy

<!-- end -->

- Action-led: buttons should always lead with a strong verb that encourages action. To provide enough context to users use the {verb}+{noun} format on buttons except in the case of common actions like Save, Close, Cancel, or OK.

<!-- usagelist -->

#### Do

- Activate Apple Pay
- View shipping settings

#### Don’t

- Try Apple Pay
- View your settings

<!-- end -->

- Scannable: avoid unnecessary words and articles such as the, an, or a.

<!-- usagelist -->

#### Do

- Add menu item

#### Don’t

- Add a menu item

<!-- end -->

### Secondary action

Secondary actions are used for less important actions such as “Learn more” or “Close” buttons. They should follow all the other content rules outlined for primary buttons.

---

## Examples

### Default empty state

Use to explain a single feature before users have used it.

```jsx
<EmptyState
  heading="Manage your inventory transfers"
  action={{ content: 'Add transfer' }}
  secondaryAction={{ content: 'Learn more', url: 'https://help.example.com' }}
  image="https://cdn.example.com/s/files/1/0757/9955/files/empty-state.svg"
>
  <p>Track and receive your incoming inventory from suppliers.</p>
</EmptyState>
```

### Empty state with subdued footer context

<!-- example-for: web -->

Use to provide additional but non-critical context for a new product or feature. Can also be used to include a subdued call to action for secondary or tertiary actions.

```jsx
<EmptyState
  heading="Manage your inventory transfers"
  action={{ content: 'Add transfer' }}
  secondaryAction={{ content: 'Learn more', url: 'https://help.example.com' }}
  footerContent={
    <p>
      If you don’t want to add a transfer, you can import your inventory from{' '}
      <Link monochrome url="/admin/settings">
        settings
      </Link>
      .
    </p>
  }
  image="https://cdn.example.com/s/files/1/0757/9955/files/empty-state.svg"
>
  <p>Track and receive your incoming inventory from suppliers.</p>
</EmptyState>
```

### Empty state within a content context

<!-- example-for: web -->

Use to explain a section or feature before users have used it within the context of a content container like a card or a resource list.

```jsx
<Card>
  <Card.Section>
    <EmptyState
      heading="Upload a file to get started"
      action={{ content: 'Upload files' }}
      image="https://cdn.example.com/s/files/1/2376/3301/products/emptystate-files.png"
    >
      <p>You can use the Files section to upload images, videos, and other documents</p>
    </EmptyState>
  </Card.Section>
</Card>
```

---

## Related components

- To learn more about illustrations for empty states, [read the illustration guidelines](https://polaris.example.com/design/illustrations)
- To create page-level layout, [use the layout component](https://polaris.example.com/components/structure/layout)
- To highlight a example feature, [use the callout card component](https://polaris.example.com/components/structure/callout-card)

---

## Accessibility

<!-- content-for: android -->

See Material Design and development documentation about accessibility for Android:

- [Accessible design on Android](https://material.io/design/usability/accessibility.html)
- [Accessible development on Android](https://developer.android.com/guide/topics/ui/accessibility/)

<!-- /content-for -->

<!-- content-for: ios -->

See Apple’s Human Interface Guidelines and API documentation about accessibility for iOS:

- [Accessible design on iOS](https://developer.apple.com/design/human-interface-guidelines/ios/app-architecture/accessibility/)
- [Accessible development on iOS](https://developer.apple.com/accessibility/ios/)

<!-- /content-for -->

<!-- content-for: web -->

Empty state illustrations are implemented as decorative images, so they use an empty `alt` attribute and are skipped by technologies like screen readers.

<!-- /content-for -->
