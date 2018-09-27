db.getCollection('profesionalSchema').aggregate([{
       "$group": {
           "_id": { "documento": "$documento"},
           "uniqueIds": { "$addToSet": "$_id" },
           "count": { "$sum": 1 }
       }
   },
   { "$match": { "count": { "$gt": 1 } } }
])