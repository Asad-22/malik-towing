import { Star } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import { SectionHeading } from '@/components/public/SectionHeading';

export function ReviewsSection() {
  const { reviews, settings } = useSiteContent();

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="scroll-mt-40 bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          title={settings.text('reviews.heading')}
          subtitle={settings.text('reviews.subheading')}
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${index < review.rating ? 'fill-brand-red text-brand-red' : 'text-slate-300'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-slate-700">
                &ldquo;{review.body}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-slate-100 pt-4">
                <p className="font-extrabold text-brand-navy">{review.author_name}</p>
                {review.location_label && <p className="text-sm text-slate-500">{review.location_label}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
