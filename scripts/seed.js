// FCC defined codes
/*
EN	Entity Type				
    CE	Transferee contact             			
    CL	Licensee Contact               			
    CR	Assignor or Transferor Contact 			
    CS	Lessee Contact                 			
    E 	Transferee                     			
    L 	Licensee or Assignee           			
    O 	Owner                          			
    R 	Assignor or Transferor         			
    S 	Lessee               

                	
EN	Applicant Type Code				
    Code	Description		Code Active?		
    B 	Amateur Club                  	A		
    C 	Corporation                   	A		
    D 	General Partnership           	A		
    E 	Limited Partnership           	A		
    F 	Limited Liability Partnership 	A		
    G 	Governmental Entity           	A		
    H 	Other                         	A		
    I 	Individual                    	A		
    J 	Joint Venture                 	N		
    L 	Limited Liability Company     A		
    M 	Military Recreation           	A		
    O 	Consortium                    	A		
    P 	Partnership                   	N		
    R 	RACES                         	A		
    T 	Trust                         	A		
    U 	Unincorporated Association   A	          			
                	
EN	Status Code				
    Null/Blank	Active			
    X	Termination Pending			
    T	Terminated 			

EN	3.7 GHz License Type
    Code	Description
    C	Combo
    R	Combo-R
    F	Final
    I	Interim
*/

//import { open } from 'node:fs/promises';
const { open } = require('node:fs/promises');

const sqlTable = "pubacc_en";

// TODO: trim this down to only the fields we care about
const lookup = [
    "record_type",
    "unique_system_identifier",
    "uls_file_number",
    "ebf_number",
    "call_sign",
    "entity_type",
    "licensee_id",
    "entity_name",
    "first_name",
    "mi",
    "last_name",
    "suffix",
    "phone",
    "fax",
    "email",
    "street_address",
    "city",
    "state",
    "zip_code",
    "po_box",
    "attention_line",
    "sgin",
    "frn",
    "applicant_type_code",
    "applicant_type_other",
    "status_code",
    "status_date",
    "lic_category_code",
    "linked_license_id",
    "linked_callsign"
];

(async () => {
    const csv = await open('../app/lib/EN.dat');

    let i = 0;

    for await (const line of csv.readLines()) {
        const [...vals] = line.split('|');
        const object = {};
        vals.forEach((val, index) => {
            object[lookup.at(index)] = val;
        })
        if (i === 0) {
            console.log(object);
            i++;
        }
    }

    console.log("Complete");
})();

async function seedAmLic(client) {
    try {
        const createTable = await client.sql`
    create table if not exists ${sqlTable} 
(      record_type               char(2)              not null,
      unique_system_identifier  numeric(9,0)         primary key,
      uls_file_number           char(14)             null,
      ebf_number                varchar(30)          null,
      call_sign                 char(10)             null,
      entity_type               char(2)              null,
      licensee_id               char(9)              null,
      entity_name               varchar(200)         null,
      first_name                varchar(20)          null,
      mi                        char(1)              null,
      last_name                 varchar(20)          null,
      suffix                    char(3)              null,
      phone                     char(10)             null,
      fax                       char(10)             null,
      email                     varchar(50)          null,
      street_address            varchar(60)          null,
      city                      varchar(20)          null,
      state                     char(2)              null,
      zip_code                  char(9)              null,
      po_box                    varchar(20)          null,
      attention_line            varchar(35)          null,
      sgin                      char(3)              null,
      frn                       char(10)             null,
      applicant_type_code       char(1)              null,
      applicant_type_other      char(40)             null,
      status_code               char(1)              null,
      status_date               datetime             null,
      lic_category_code         char(1)              null,
      linked_license_id         numeric(9,0)         null,
      linked_callsign           char(10)             null
);`;

        console.log(`Created "amLic" table`);

        // Insert data into the "users" table
        const insertedUsers = await Promise.all(
            users.map(async (user) => {
                return client.sql`
        INSERT INTO ${sqlTable} (
            record_type, unique_system_identifier, uls_file_number, ebf_number, call_sign, entity_type, licensee_id, 
            entity_name, first_name, mi, last_name, suffix, phone, fax, email, street_address, city, state, zip_code, 
            po_box, attention_line, sgin, frn, applicant_type_code, applicant_type_other, status_code, status_date, 
            lic_category_code, linked_license_id, linked_callsign
        )
        VALUES (
            ${user.record_type}, ${user.unique_system_identifier}, ${user.uls_file_number}, ${user.ebf_number}, 
            ${user.call_sign}, ${user.entity_type}, ${user.licensee_id}, ${user.entity_name}, ${user.first_name}, 
            ${user.mi}, ${user.last_name}, ${user.suffix}, ${user.phone}, ${user.fax}, ${user.email}, ${user.street_address},
            ${user.city}, ${user.state}, ${user.zip_code}, ${user.po_box}, ${user.attention_line}, ${user.sgin}, ${user.frn},
            ${user.applicant_type_code}, ${user.applicant_type_other}, ${user.status_code}, ${user.status_date}, 
            ${user.lic_category_code}, ${user.linked_license_id}, ${user.linked_callsign}
        )
        ON CONFLICT (unique_system_identifier) DO NOTHING;
      `;
            }),
        );

        console.log(`Seeded ${insertedUsers.length} users`);

        return {
            createTable,
            users: insertedUsers,
        };
    } catch (error) {
        console.error('Error seeding amLic:', error);
        throw error;
    }
}

// TODO: if db table exists read unique list of unique ids
// TODO: skip line in file if unique_system_identifier in set of ids from db
// TODO: long term: this handles weekly full data dumps; modify or create a new script to handle daily updates
//
