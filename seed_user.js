const supabaseUrl = 'https://jdnndyyzsbsnparcszck.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkbm5keXl6c2JzbnBhcmNzemNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzA5MjIyNSwiZXhwIjoyMDkyNjY4MjI1fQ.QntDQkwomItPUj_tpS_uvb3TA2V0M-r7iA8j57KEAu4';

async function verifyUser() {
    try {
        // 1. Get all users
        const getResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
            method: 'GET',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`
            }
        });

        const data = await getResponse.json();
        const users = data.users || [];

        const targetUser = users.find(u => u.email === 'acxml03@gmail.com');

        if (!targetUser) {
            console.log('User not found in list. Trying to create again?');
            return;
        }

        console.log(`Found user ${targetUser.email} with ID ${targetUser.id}`);

        // 2. Update user to confirm email and set password to 12345678 just in case
        const updateResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${targetUser.id}`, {
            method: 'PUT',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email_confirm: true,
                password: '12345678'
            })
        });

        const updateData = await updateResponse.json();

        if (!updateResponse.ok) {
            console.error('Error updating user:', updateData);
        } else {
            console.log('Success! User updated and confirmed.');
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

verifyUser();
