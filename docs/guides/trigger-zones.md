# Trigger Zones

Trigger zones are useful when you want a subtree or a side effect to respond only within a progress band.

In React:

```tsx
<ImmersiveTriggerZone
  start={0.2}
  end={0.45}
  onEnter={() => console.log('entered')}
>
  <aside>Contextual copy</aside>
</ImmersiveTriggerZone>
```
