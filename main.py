import telebot

bot = telebot.TeleBot('5731087510:AAEZu1fH8P_BmT5CCIOe_uGThFf3JI7hvVc')


@bot.message_handler(commands=['start'])
def start(message):
    bot.send_game(message.chat.id, game_short_name='Ping-Pong')


@bot.callback_query_handler(func=lambda callback_query: callback_query.game_short_name == 'Ping_Pong')
def game(call):
    bot.answer_callback_query(callback_query_id=call.id, url='file:///C:/Users/m68000/Desktop/pong/index.html')


if __name__ == '__main__':
    bot.polling(none_stop=True)