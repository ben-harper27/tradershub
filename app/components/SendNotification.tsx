

export async function SendNotification(push_api) {
    // Send notification, provided userAlice has a channel
    const response = await push_api.channel.send(["*"], {
        notification: {
            title: "You have subscribed to the coin loop push channel!",
            body: "You have subscribed to the coin loop push channel!",
        },
    });
}