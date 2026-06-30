def getReply(user_message):
    # You can call your OpenAI or DB logic here
    # For now, a simple placeholder:
    if "product" in user_message.lower():
        return "Here are some products matching your query!"
    return "Hello! How can I help you today?"
