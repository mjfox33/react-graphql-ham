import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import {
    LicenseTypeCounts
} from './definitions';
//import { formatCurrency } from './utils';

export async function fetchLicenseTypesCounts() {
    noStore();
    try {
        const data = await sql<LicenseTypeCounts>
            `select applicant_type_code, count(unique_system_identifier) from table group by applicant_type_code`;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch License Types Counts.');
    }
}

export async function fetchDashboardCardData() {
    noStore();
    try {
        const activeCountPromise = sql`select count(*) from table where applicant_type_code is null`;
        const pendingTermCountPromise = sql`select count(*) from table where applicant_type_code == 'X'`;
        const terminatedCountPromise = sql`select count(*) from table where applicant_type_code == 'T'`;
        const activeNCPromise = sql`select count(*) from table where applicant_type_code is null and state == 'NC'`;

        const data = await Promise.all([
            activeCountPromise,
            pendingTermCountPromise,
            terminatedCountPromise,
            activeNCPromise
        ]);

        const numberOfActive = Number(data[0].rows[0].count ?? '0');
        const numberOfPendingTerm = Number(data[1].rows[0].count ?? '0');
        const numberOfTerminated = Number(data[2].rows[0].count ?? '0');
        const numberOfActiveInNC = Number(data[3].rows[0].count ?? '0');

        return {
            numberOfActive,
            numberOfPendingTerm,
            numberOfTerminated,
            numberOfActiveInNC
        };

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch Database Card Data.');
    }
}
