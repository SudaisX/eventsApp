import { API_URL } from '@/config/index';
import Layout from '@/components/Layout';
import EventItem from '@/components/EventItem';
import Link from 'next/link';
const PAGE_SIZE = 5;

const EventsPage = ({ events, page, total }) => {
    const lastPage = Math.ceil(total / PAGE_SIZE);

    return (
        <Layout>
            <h1>Events</h1>
            {events.length === 0 ? (
                <h3>No Events to Show..</h3>
            ) : (
                events.map((evt) => <EventItem key={evt.id} evt={evt} />)
            )}

            {page > 1 && (
                <Link href={`/events?page=${page - 1}`}>
                    <a className='btn-secondary'>Prev</a>
                </Link>
            )}
            {page < lastPage && (
                <Link href={`/events?page=${page + 1}`}>
                    <a className='btn-secondary'>Next</a>
                </Link>
            )}
        </Layout>
    );
};

export default EventsPage;

export async function getServerSideProps({ query: { page = 1 } }) {
    console.log(page);

    const res = await fetch(
        `${API_URL}/api/events?sort=date:asc&populate=*&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}&pagination[withCount]=true`
    );
    const {
        data,
        meta: {
            pagination: { total },
        },
    } = await res.json();
    const events = data.map((evt) => ({ id: evt.id, ...evt.attributes }));
    return {
        props: { events, page: +page, total },
    };
}
