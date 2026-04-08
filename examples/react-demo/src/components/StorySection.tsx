interface StorySectionProps {
  index: string;
  title: string;
  description: string;
}

export function StorySection({ index, title, description }: StorySectionProps) {
  return (
    <article className="story-card">
      <p className="story-index">{index}</p>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
