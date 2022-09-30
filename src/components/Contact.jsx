import React from 'react'

const Contact = () => {
  return (
    <div name='contact' className='w-full bg-white dark:bg-bg-[#0a192f] flex justify-center items-center p-4 md:py-14'>
      <section class="bg-white dark:bg-bg-[#0a192f] md:border shadow p-3 rounded-lg">
        <div class="py-8 px-4 mx-auto max-w-screen-md">
            <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-center text-green-600">Contact</h2>
            <p class="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.</p>
            <form action="#" class="space-y-6">
                <div>
                    <label for="email" class="block mb-2 text-[#0a192f] font-semibold italic text-normal">Your email</label>
                    <input type="email" id="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@emailprovider.com" required />
                </div>
                <div>
                    <label for="subject" class="block mb-2 text-[#0a192f] font-semibold italic text-normal">Subject</label>
                    <input type="text" id="subject" class="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Let me know how I can help you" required />
                </div>
                <div class="sm:col-span-2">
                    <label for="message" class="block mb-2 text-[#0a192f] font-semibold italic text-normal">Your message</label>
                    <textarea id="message" rows="6" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave me a comment..."></textarea>
                </div>
                <button type="submit" class="py-3 px-5 text-normal font-semibold capitalize text-center text-white rounded-lg bg-green-500 sm:w-fit hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send message</button>
            </form>
        </div>
      </section>
    </div>
  )
}

export default Contact