import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';
import { useRouter } from 'next/router';

export default function EventPage({ evt }) {
    const router = useRouter();

    const deleteEvent = async (e) => {
        if (confirm('Are you sure?')) {
            const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!res.ok) {
                return toast.error(data.message);
            } else {
                router.push('/events');
            }
        }
    };

    return (
        <Layout>
            <div className={styles.event}>
                <Link href='/events'>
                    <a className={styles.back}> {'<'} Go Back</a>
                </Link>

                {evt ? (
                    <>
                        <div className={styles.controls}>
                            <Link href={`/events/edit/${evt.id}`}>
                                <a>
                                    <FaPencilAlt /> Edit Event
                                </a>
                            </Link>
                            <a href='#' className={styles.delete} onClick={deleteEvent}>
                                <FaTimes /> Delete Event
                            </a>
                        </div>

                        <span>
                            {new Date(evt.date).toLocaleDateString('en-US')} at {evt.time}
                        </span>

                        <h1>{evt.name}</h1>

                        <ToastContainer />

                        {evt.image && (
                            <div className={styles.image}>
                                <Image
                                    // src={evt.image.data.attributes.url}
                                    src={
                                        evt.image && evt.image.data
                                            ? evt.image.data.attributes.url
                                            : '/images/event-default.png'
                                    }
                                    layout='fill'
                                    objectFit='contain'
                                    alt='image'
                                />
                            </div>
                        )}

                        <h3>Description</h3>
                        <p>{evt.description}</p>

                        <h3>Venue: {evt.venue}</h3>
                        <p>{evt.address}</p>
                    </>
                ) : (
                    <h1>Event not found..</h1>
                )}
            </div>
        </Layout>
    );
}

// export async function getStaticPaths() {
//     const res = await fetch(`${API_URL}/api/events?populate=*`);
//     const { data } = await res.json();
//     const events = data.map((evt) => ({ id: evt.id, ...evt.attributes }));

//     const paths = events.map((evt) => ({ params: { slug: evt.slug } }));

//     return {
//         paths,
//         fallback: true,
//     };
// }

// export async function getStaticProps({ params: { slug } }) {
//     const res = await fetch(`${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=*`);
//     const { data } = await res.json();
//     const events = data.map((evt) => ({ id: evt.id, ...evt.attributes }));
//     return {
//         props: {
//             evt: events[0],
//         },
//     };
// }

export async function getServerSideProps({ query: { slug } }) {
    const res = await fetch(`${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=*`);
    const { data } = await res.json();
    const events = data.map((evt) => ({ id: evt.id, ...evt.attributes }));
    return {
        props: {
            evt: events[0] ? events[0] : null,
        },
    };
}
