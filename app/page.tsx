import React from 'react';

function hello() {
  return (
    <section className="pt-64"> {/* Added padding-top to the section */}
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8"> {/* Adjusted padding */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
          <div>
            <div className="max-w-lg md:max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                Movie Management App
              </h2>

              <p className="mt-4 text-gray-700">
                Manage Your Movies Here!
              </p>
            </div>
          </div>

          <div>
            <img
              src="/movie_photo.jpeg"
              className="rounded w-96 h-auto"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default hello;