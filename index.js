const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 3000,
    });
    
    server.route({
        method: 'POST',
        path: '/api/amblUser',
        handler: async(request, h) => {

            const client = require('@sendgrid/client');
            const clientEmail = require('@sendgrid/mail');
            clientEmail.setApiKey('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');
            client.setApiKey('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');

            const websiteSubscribersOctListID = '5f002860-d206-41af-b7e8-05747a9d7458'

            console.log(request.payload);

            const data = {
                list_ids: [websiteSubscribersOctListID],
                "contacts": [
                    {
                    "email": request.payload.Email,
                    "first_name": request.payload.name,
                    "last_name": request.payload['Last-Name'],
                    "phone_number": request.payload.Mobile,
                    }
                ]
            };

            const contactRequest = {
            url: `/v3/marketing/contacts`,
            method: 'PUT',
            body: data
            }

            client.request(contactRequest)
            .then(([response, body]) => {
                console.log(response.statusCode);
                console.log(response.body);

                const msg = {
                    to: 'alex@vouchglobal.com',
                    from: 'kevin.patrick@ambl.co', // Use the email address or domain you verified above
                    subject: 'New Submission from AMBL.CO Homepage',
                    text: `New venue submission for ${request.payload['Venue-Name']}`,
                    html: `<p>New email submission for ${request.payload['name']} ${request.payload['Last-Name']}</p>`,
                  };
                  //ES6
                  clientEmail
                    .send(msg)
                    .then((res) => {
                        console.log(res, 'Message Sent');
                    }, error => {
                      console.error(error);
                  
                      if (error.response) {
                        console.error(error.response.body)
                      }
                    });
            })
            .catch(error => {
                console.error(error.response.body.errors);
            });
            

            return "Hello World"
        }
    });    
    
    server.route({
        method: 'POST',
        path: '/api/amblVenue',
        handler: async(request, h) => {

            const client = require('@sendgrid/client');
            const clientEmail = require('@sendgrid/mail');
            clientEmail.setApiKey('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');
            client.setApiKey('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');

            const websiteVenueList = '256e787e-dece-4367-90fa-b71e10d86b9b'

            console.log(request.payload);

            const data = {
                list_ids: [websiteVenueList],
                "contacts": [
                    {
                    "email": request.payload.Email,
                    "first_name": request.payload.name,
                    "last_name": request.payload['Last-Name'],
                    "phone_number": request.payload.Mobile,
                    "custom_fields": {
                        "e22_T": request.payload.Location,
                        "e2_T": request.payload['Venue-Name'],
                        "e23_T": request.payload['Job-Title']
                        }
                    }
                ]
            };

            const contactRequest = {
            url: `/v3/marketing/contacts`,
            method: 'PUT',
            body: data
            }

            client.request(contactRequest)
            .then(([response, body]) => {
                console.log(response.statusCode);
                console.log(body);

                const msg = {
                    to: 'alex@vouchglobal.com',
                    from: 'kevin.patrick@ambl.co', // Use the email address or domain you verified above
                    subject: 'New Submission from AMBL.CO Partner Page',
                    text: `New venue submission for ${request.payload['Venue-Name']}`,
                    html: `<p>New venue submission for ${request.payload['Venue-Name']}</p>`,
                  };
                  //ES6
                  clientEmail
                    .send(msg)
                    .then((res) => {
                        console.log(res, 'Message Sent');
                    }, error => {
                      console.error(error);
                  
                      if (error.response) {
                        console.error(error.response.body)
                      }
                    });
                // clientEmail
                // .send(message)
                // .then((res) => console.log('Mail sent successfully', res))
                // .catch(error => {
                //     console.error(error.response.body.errors);
                // });
            })
            .catch(error => {
                console.error(error.response.body.errors);
            });            

            return "Hello World"
        }
    });  

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

init();