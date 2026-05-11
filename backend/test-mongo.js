const mongoose = require('mongoose');

// Test different MongoDB connection patterns
const connectionStrings = [
  'mongodb+srv://rahulkumar8600:wQvzL8XHx8mF4HdS@cluster0.ryv9c.mongodb.net/crm?retryWrites=true&w=majority',
  'mongodb+srv://rahulkumar8600:wQvzL8XHx8mF4HdS@cluster0.abcde.mongodb.net/crm?retryWrites=true&w=majority',
  'mongodb+srv://rahulkumar8600:wQvzL8XHx8mF4HdS@cluster0.mongodb.net/crm?retryWrites=true&w=majority'
];

async function testConnections() {
  for (let i = 0; i < connectionStrings.length; i++) {
    console.log(`\nTesting connection ${i + 1}:`);
    console.log(`URI: ${connectionStrings[i]}`);
    
    try {
      await mongoose.connect(connectionStrings[i], {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000 // 5 second timeout
      });
      console.log('✅ Connection successful!');
      await mongoose.connection.close();
      return connectionStrings[i];
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
    }
  }
  return null;
}

testConnections().then(workingUri => {
  if (workingUri) {
    console.log('\n🎉 Working URI found:', workingUri);
  } else {
    console.log('\n❌ No working connection found. Please check your MongoDB Atlas settings.');
  }
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
