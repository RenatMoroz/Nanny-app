'use client';

import css from './NannyModal.module.css';
import { sendLessonEmail } from '@/services/nannyModal';
import { Nanny } from '@/types/nannys';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
interface NannyProps {
  nanny: Nanny;
}
const NannyModal = ({ nanny }: NannyProps) => {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);

    try {
      await sendLessonEmail({
        Address: formData.get('address') as string,
        Email: formData.get('email') as string,
        Phone: formData.get('phone') as string,
        ChildAge: Number(formData.get('childAge')),
        MeetingTime: String(formData.get('meetingTime')),
        ParentName: formData.get('parentName') as string,
        Comment: formData.get('comment') as string,
      });

      toast.success('You have successfully booked a nanny! 🎉');
      form.reset();
      router.push('/nannies');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    }
  };
  return (
    <div className={css['nannyModal']}>
      <div className={css.modal}>
        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.header}>
            <h2 className={css.title}>Make an appointment with a babysitter</h2>
            <p className={css.description}>
              Arranging a meeting with a caregiver for your child is the first
              step to creating a safe and comfortable environment. Fill out the
              form below so we can match you with the perfect care partner.
            </p>
          </div>
          <div className={css['teacher-img-block']}>
            <Image
              src={nanny.avatar_url}
              alt={`${nanny.name}`}
              className={css['nannyImage']}
              width={96}
              height={96}
              unoptimized
              loader={({ src }) => src}
            />
            <div className={css['nanny-block-text']}>
              <h3 className={css['nanny']}>Your nanny</h3>
              <p className={css['nanny-name']}>{nanny.name}</p>
            </div>
          </div>
          <div className={css.twoCols}>
            <input
              className={css.input}
              type="text"
              name="address"
              placeholder="Address"
              required
            />
            <input
              className={css.input}
              type="tel"
              name="phone"
              placeholder="+380"
              required
            />
          </div>

          <div className={css.twoCols}>
            <input
              className={css.input}
              type="number"
              name="childAge"
              placeholder="Child's age"
              min={0}
              required
            />

            <div className={css.timeWrap}>
              <select className={css.input} name="meetingTime" required>
                <option value="">00:00</option>
                <option value="09:00">09:00</option>
                <option value="09:30">09:30</option>
                <option value="10:00">10:00</option>
                <option value="10:30">10:30</option>
                <option value="11:00">11:00</option>
              </select>
              <svg
                className={css.timeIcon}
                width={16}
                height={16}
                aria-hidden="true"
              >
                <use href="/icons-sprite.svg#icon-clock"></use>
              </svg>
            </div>
          </div>

          <input
            className={css.input}
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <input
            className={css.input}
            type="text"
            name="parentName"
            placeholder="Father's or mother's name"
            required
          />

          <textarea
            className={css.textarea}
            name="comment"
            placeholder="Comment"
            rows={5}
          />

          <button className={css.submitButton} type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default NannyModal;
