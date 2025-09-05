# Reto Técnico Back End – Citas Médicas (AWS + Node.js + Serverless)

## Descripción
Aplicación backend para el agendamiento de citas médicas de asegurados en Perú y Chile.  
El sistema permite registrar un agendamiento, enviarlo a un flujo asincrónico con SNS/SQS/EventBridge y actualizar el estado del agendamiento de `pending` a `completed`.  

La arquitectura está implementada con **Node.js + TypeScript**, **Serverless Framework**, y servicios **AWS**:  
- API Gateway  
- Lambda  
- DynamoDB  
- SNS + SQS  
- EventBridge  
- RDS MySQL  

---

## Arquitectura
1. **POST /appointments**  
   - Recibe la petición.  
   - Guarda estado `pending` en DynamoDB.  
   - Publica evento en SNS con atributo `countryISO`.  

2. **SNS → SQS por país**  
   - `SQS_PE` para Perú.  
   - `SQS_CL` para Chile.  

3. **Workers (appointment_pe, appointment_cl)**  
   - Consumen de la cola correspondiente.  
   - Guardan registro en MySQL (RDS).  
   - Publican confirmación en EventBridge.  

4. **EventBridge → SQS_CONFIRMATION → appointment**  
   - Lambda `appointment` recibe la confirmación.  
   - Actualiza estado en DynamoDB a `completed`.  

5. **GET /appointments/{insuredId}**  
   - Lista citas del asegurado con estado actual (`pending` o `completed`).  

---

## Requisitos
- Node.js 20+  
- Serverless Framework v4  
- Cuenta AWS con permisos: Lambda, DynamoDB, SNS, SQS, EventBridge, RDS  

---

## Variables de Entorno

provider:
# environment:
    DDB_TABLE: AppointmentsTable
    APPOINTMENT_TOPIC_ARN: !Ref AppointmentTopic
    EVENT_BUS_NAME: default

    # Conexión a MySQL (RDS)
    PE_DB_HOST: dbappointment.c2jccqskykox.us-east-1.rds.amazonaws.com
    PE_DB_PORT: "3306"
    PE_DB_USER: admin
    PE_DB_PASS: "Softtek#2023"
    PE_DB_NAME: app_pe

    CL_DB_HOST: dbappointment.c2jccqskykox.us-east-1.rds.amazonaws.com
    CL_DB_PORT: "3306"
    CL_DB_USER: admin
    CL_DB_PASS: "Softtek#2023"
    CL_DB_NAME: app_cl

## Cómo Ejecutar
* Local (offline)
* npx serverless offline

## Endpoints disponibles:
* POST http://localhost:3000/appointments
* GET http://localhost:3000/appointments/{insuredId}

## AWS (desplegar)
* npx serverless deploy

## Endpoints desplegados (ejemplo):
* POST - https://yj6hb7xlw1.execute-api.us-east-1.amazonaws.com/appointments
* GET  - https://yj6hb7xlw1.execute-api.us-east-1.amazonaws.com/appointments/{insuredId}

## Documentación OpenAPI
1. Ingresar a swagger editor: https://swagger.io/tools/swagger-editor/
2. Importar la sgte url: https://yj6hb7xlw1.execute-api.us-east-1.amazonaws.com/docs

## Tests
## Ejecutar todos los tests:
* npm run test

## Con cobertura:
* npm run test:cov
   

