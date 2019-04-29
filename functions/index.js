const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase)

//1. hoe krijg je het hele events object erin na d eonUpdate function? https://stackoverflow.com/questions/48241126/how-to-access-cloud-firestore-from-a-cloud-function?rq=1
//2. Vind de hostUid van het event dat wordt geupdate in de functie 
//3. Maak een functie die het events obeject obv hostUI de events selecteert en de event.totalCount opsomt. 
//4. Zorg dat je het resultaat in een waarde kan gebruiken om totalScore van User te updaten. 

exports.updateTotalCountUser = functions.firestore.document('events/{eventId}').onUpdate((event, context) => {
    let previousEventData = event.before.data();

    const eventsArray = admin
    .firestore()
    .collection('events')
    .where('hostUid', '==', previousEventData.hostUid)


    return eventsArray.get().then(querySnapshot => {
      eventArray = querySnapshot.docs.map((documentSnapshot) => {
      return documentSnapshot.get("totalCount");
      });
      console.log(eventArray)
      const add = (a, b) => a + b
      // use reduce to sum our array
      const sumCount = eventArray.reduce(add)
      console.log(sumCount)
      let updateCount = {
        totalCount: sumCount
      }
      return admin
          .firestore()
          .collection('users')
          .doc(previousEventData.hostUid)
          .update(updateCount)
    })
    .catch(err => {
      return console.log('Error adding activity', err);
    });
   
  });