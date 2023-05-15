// == JS ACCORDION (SECTION FAQ) == //

function FAQ(){
  const faqs = document.querySelectorAll(".faq");
  faqs.forEach((faq) =>{
    faq.addEventListener("click",()=>{
      faq.classList.toggle("active");
  });
});
}

// == JS FILTER (SECTION COURSE) == //
function filter(){
  const buttons = document.querySelectorAll(".button");
  const courses = document.querySelectorAll(".course__item");

  function filterCourses(category,items){
    items.forEach((item)=>{
      const isItemFiltered = !item.classList.contains(category);
      const isShowAll = category.toLowerCase() === 'all'
      if (isItemFiltered && !isShowAll ){
        item.classList.add('hide')
      }else{
        item.classList.remove('hide')
      };
    });
  }
  
  buttons.forEach((button)=>{
    button.addEventListener('click', () =>{
      const currentCategory = button.dataset.filter;
      filterCourses(currentCategory,courses);
    });
  });
}

// == JS SIDEBAR (SECTION USER) == //
function sidebar(){
  const body = document.querySelector("body"),
  sidebar = body.querySelector(".sidebar");
  toggle = body.querySelector(".toggle");
  searchbtn = body.querySelector(".search__box");

  toggle.addEventListener('click', () =>{
    sidebar.classList.toggle("close");
  });

  searchbtn.addEventListener('click', () =>{
    sidebar.classList.remove("close");
  });

}





FAQ();
filter();
sidebar();