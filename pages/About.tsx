import React from 'react';

const About: React.FC = () => {
  return (
    <div className="animate-fade-in bg-nomad-paper pt-40 pb-20">
      
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="text-center mb-24 fade-up">
            <span className="text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Est. 2026</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-nomad-black">
                The Pursuit of <br/> Excellence
            </h1>
            <div className="w-24 h-1 bg-nomad-gold mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl font-serif italic text-gray-500 max-w-3xl mx-auto leading-relaxed">
                "We believe that every cup of coffee tells a story—of the land it grew on, the farmers who tended it, and the hands that brewed it."
            </p>
        </div>

        {/* Feature Image */}
        <div className="w-full h-[60vh] overflow-hidden rounded-[3rem] mb-24 shadow-2xl fade-up">
           <img 
             src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1600" 
             alt="Coffee Farm" 
             className="w-full h-full object-cover parallax-effect scale-105"
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-24 fade-up">
            <div>
               <h2 className="text-3xl font-serif font-bold mb-6">Our Origins</h2>
               <p className="text-gray-600 text-lg leading-relaxed mb-6">
                   Coffee Machines Hub began as a small passion project in a garage, tinkering with espresso machines and roasting samples on a popcorn popper. 
                   Our obsession with the mechanics of extraction led us to curate a collection of the world's finest brewing equipment.
               </p>
               <p className="text-gray-600 text-lg leading-relaxed">
                   Today, we are a team of certified Q-graders, engineers, and baristas united by a single goal: to help you brew better coffee.
               </p>
            </div>
            <div className="bg-white p-10 md:p-12 rounded-3xl shadow-sm border border-gray-100">
               <h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-nomad-black">Core Values</h3>
               <ul className="space-y-6">
                  <li className="flex items-start">
                     <span className="text-nomad-gold font-serif text-2xl mr-4 leading-none">01.</span>
                     <p className="text-gray-600 leading-relaxed"><strong>Quality First.</strong> We never compromise on the quality of our beans or the durability of our machines.</p>
                  </li>
                  <li className="flex items-start">
                     <span className="text-nomad-gold font-serif text-2xl mr-4 leading-none">02.</span>
                     <p className="text-gray-600 leading-relaxed"><strong>Transparency.</strong> We believe in direct trade and fair pricing for farmers and manufacturers.</p>
                  </li>
                  <li className="flex items-start">
                     <span className="text-nomad-gold font-serif text-2xl mr-4 leading-none">03.</span>
                     <p className="text-gray-600 leading-relaxed"><strong>Education.</strong> We don't just sell; we teach. Empowering our customers is our greatest joy.</p>
                  </li>
               </ul>
            </div>
        </div>

        {/* Team Section */}
        <div className="mb-24 fade-up">
            <h2 className="text-3xl font-serif font-bold mb-16 text-center">Meet The Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
               {[
                   { name: "Sarah Jenkins", role: "Head Roaster", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" },
                   { name: "David Chen", role: "Equipment Specialist", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
                   { name: "Elena Rodriguez", role: "Q Grader", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" }
               ].map((member, i) => (
                   <div key={i} className="group text-center">
                       <div className="rounded-full overflow-hidden aspect-square w-48 mx-auto mb-6 border-4 border-transparent group-hover:border-nomad-gold transition-all duration-500 shadow-lg">
                           <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                       </div>
                       <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                       <p className="text-nomad-gold text-xs font-bold uppercase tracking-widest">{member.role}</p>
                   </div>
               ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;