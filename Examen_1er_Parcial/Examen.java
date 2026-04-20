
package examen;
import java.util.Scanner;

public class Examen {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String nombre;
        int anioNacimiento = 0;
        int edad;
        int anioActual = 2026;
        do {
            System.out.print("Ingresa tu nombre: ");
            nombre = sc.nextLine();

            if (nombre.trim().isEmpty()) {
                System.out.println("El nombre no puede estar vacío.");
            }

        } while (nombre.trim().isEmpty());

        boolean valido = false;
        do {
            System.out.print("Ingresa tu año de nacimiento: ");

            if (sc.hasNextInt()) {
                anioNacimiento = sc.nextInt();
                valido = true;
            } else {
                System.out.println("Debes ingresar un número.");
                sc.next(); // limpiar entrada incorrecta
            }

        } while (!valido);

        edad = anioActual - anioNacimiento;

        if (edad < 18) {
            System.out.println("Eres menor de edad. No puedes usar el programa.");
            return;
        }

        System.out.println("Bienvenido " + nombre + ". Puedes usar el programa.");

        double[] numeros = new double[100];
        int n = 0;
        double num;

        System.out.println("Ingresa numeros (0 para terminar):");

        do {
            while (!sc.hasNextDouble()) {
                System.out.println("Entrada invalida. Ingresa un numero:");
                sc.next();
            }

            num = sc.nextDouble();

            if (num != 0) {
                numeros[n] = num;
                n++;
            }

        } while (num != 0);

        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1; j++) {
                if (numeros[j] > numeros[j + 1]) {
                    double aux = numeros[j];
                    numeros[j] = numeros[j + 1];
                    numeros[j + 1] = aux;
                }
            }
        }

        double suma = 0;
        for (int i = 0; i < n; i++) {
            suma += numeros[i];
        }
        double media = suma / n;

        double mediana;
        if (n % 2 == 0) {
            mediana = (numeros[n/2 - 1] + numeros[n/2]) / 2;
        } else {
            mediana = numeros[n/2];
        }

        double moda = numeros[0];
        int maxFrecuencia = 0;

        for (int i = 0; i < n; i++) {
            int frecuencia = 0;

            for (int j = 0; j < n; j++) {
                if (numeros[i] == numeros[j]) {
                    frecuencia++;
                }
            }

            if (frecuencia > maxFrecuencia) {
                maxFrecuencia = frecuencia;
                moda = numeros[i];
            }
        }

        System.out.println("\nResultados:");
        System.out.println("Media: " + media);
        System.out.println("Mediana: " + mediana);
        System.out.println("Moda: " + moda);

        sc.close();
    }
}