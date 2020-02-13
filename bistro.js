        document.addEventListener("DOMContentLoaded", start);
        let personer = [];
        let filter = "alle";
        let filterAlder = 0;
        const detalje = document.querySelector("#popup")

        function start() {
            hentData();
        }

        async function hentData() {
            const response = await fetch("https://spreadsheets.google.com/feeds/list/17Dd7DvkPaFamNUdUKlrFgnH6POvBJXac7qyiS6zNRw0/od6/public/values?alt=json");

            personer = await response.json();
            console.log(personer);
            visPersoner();
            addEventlistenersToButtons();

        }

        function visPersoner() {

            const container = document.querySelector(".data-container");
            container.innerHTML = "";
            const template = document.querySelector("template");

            personer.feed.entry.forEach(person => {
                if ((filter == "alle" || filter == person.gsx$kategori.$t) && (person.gsx$pris.$t > filterAlder)) {
                    let klon = template.cloneNode(true).content;

                    klon.querySelector("h2").textContent = person.gsx$navn.$t;
                    klon.querySelector("h3").textContent += person.gsx$pris.$t;
                    klon.querySelector("p").textContent = "Oprindelse: " + person.gsx$oprindelse.$t;
                    klon.querySelector("h4").textContent += person.gsx$lang.$t;
                    klon.querySelector(".pic").src = "imgs/small/" + person.gsx$billede.$t + "-sm.jpg";

                    klon.querySelector("#undervisere").addEventListener("click", function () {
                        visDetalje(person);
                    });


                    container.appendChild(klon);
                }

            });

        }

        function addEventlistenersToButtons() {
            document.querySelectorAll(".filter").forEach(elm => {
                elm.addEventListener("click", filtering);
            })
            document.querySelector(".aldersFilter").addEventListener("click", aldersFiltrering)
        }

        function filtering() {
            console.log("this");
            filter = this.dataset.kategori;
            visPersoner();
            document.querySelector("h1").textContent = this.textContent;

            document.querySelectorAll(".filter").forEach(elm => {
                elm.classList.remove("valgt");
            })
            this.classList.add("valgt");

        }

        function aldersFiltrering() {
            if (filterAlder == 0) {
                filterAlder = this.dataset.pris_over;
                this.classList.add("valgt")
            } else {
                filterAlder = 0;
                this.classList.remove("valgt")
            }

        }

        function visDetalje(person) {
            detalje.classList.remove("skjul")
            detalje.querySelector("#xbutton").addEventListener("click", () => detalje.classList.add("skjul"))
            document.querySelector("h1").textContent = person.gsx$navn.$t;
            document.querySelector("h2").textContent += person.gsx$pris.$t;
            document.querySelector("p").textContent = person.gsx$oprindelse.$t;
            document.querySelector(".picup").src = "imgs/small/" + person.gsx$billede.$t + "-sm.jpg";

            console.log(person.gsx$navn.$t)
        }
