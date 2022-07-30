import qs from 'qs';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_URL } from '@/config/index';
import Layout from '@/components/Layout';
import EventItem from '@/components/EventItem';

const SearchPage = ({ events }) => {
    const router = useRouter();

    return (
        <Layout title='Search Results'>
            <Link href='/events'>Go Back</Link>
            <h1>Search Results for {router.query.term}</h1>
            {events.length === 0 ? (
                <h3>No Events found..</h3>
            ) : (
                events.map((evt) => <EventItem key={evt.id} evt={evt} />)
            )}
        </Layout>
    );
};

export default SearchPage;

export async function getServerSideProps({ query: { term } }) {
    const query = qs.stringify({
        filters: {
            $or: [
                { name: { $contains: term } },
                { description: { $contains: term } },
                { venue: { $contains: term } },
            ],
        },
    });

    // const res = await fetch(`${API_URL}/api/events?filters[name][$contains]=${term}&populate=*`);
    const res = await fetch(`${API_URL}/api/events?${query}&populate=*`);
    const { data } = await res.json();
    const events = data.map((evt) => ({ id: evt.id, ...evt.attributes }));
    return {
        props: { events },
    };
}
