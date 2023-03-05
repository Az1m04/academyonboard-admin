# Click to copy

Use to make any text copyable to clipboard by clicking on it

## Example usage

```jsx
<ClickToCopy
  title={task?.id}
  beforeCopiedTooltipTitle="Click to copy task id."
  afterCopiedTooltipTitle="Task id copied to clipboard."
  textToCopy={task?.id}
/>
```

Icon only example

```jsx
<ClickToCopy iconOnly textToCopy={link} />
```
