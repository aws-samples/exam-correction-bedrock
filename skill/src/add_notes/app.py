import boto3
import json
import re
import os
import logging
import gettext
from ask_sdk_core.skill_builder import SkillBuilder
from ask_sdk_core.dispatch_components import (
    AbstractRequestHandler, AbstractRequestInterceptor, AbstractExceptionHandler)
import ask_sdk_core.utils as ask_utils
from ask_sdk_core.handler_input import HandlerInput
from ask_sdk_model import Response
from alexa import data

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

boto3_session = boto3.session.Session()
region = boto3_session.region_name

class LaunchRequestHandler(AbstractRequestHandler):
    """Handler for Skill Launch."""

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_request_type("LaunchRequest")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        _ = handler_input.attributes_manager.request_attributes["_"]
        speak_output = _(data.WELCOME_MESSAGE)

        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(speak_output)
            .response
        )

class AdicionarAnotacaoIntentHandler(AbstractRequestHandler):
    """Handler for ConsultarDados Intent."""
    
    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_intent_name("AdicionarAnotacaoIntent")(handler_input)
        
    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        _ = handler_input.attributes_manager.request_attributes["_"]
        session_attr = handler_input.attributes_manager.session_attributes
        
        print(boto3.__version__)
        
        question = handler_input.request_envelope.request.intent.slots["query"].value
        print(question)
        
        if "messages" not in session_attr:
            session_attr["messages"] = []
        
        messages = session_attr["messages"]
        messages.append(self.format_message("user", question))
        context = self.get_context_file()
    
        if context:
            # Executa a query no Bedrock
            model_id = "anthropic.claude-3-haiku-20240307-v1:0"
            get_answer = self.query_bedrock(context, messages, model_id)
            print(get_answer)
            
            # Executa a query no DynamoDB
            task_result = ""
            try:
                dynamodb = boto3.client('dynamodb')
                dynamodb_results = dynamodb.execute_statement(
                    Statement=get_answer
                )
                print(dynamodb_results)
                task_result = "Executei a tarefa com sucesso."
            except Exception as err:
                task_result = "Não consegui executar a tarefa"
                print(err)

            final_answer = task_result
            
            session_attr["messages"].append(self.format_message("assistant", final_answer))
            
            return (
                handler_input.response_builder
                .speak(final_answer)
                .ask("O que mais você gostaria de fazer?")
                .response
            )
        
        else:
            print(f"Error")
            return (
                handler_input.response_builder
                .speak("Não consegui executar a tarefa, por favor tente perguntar de outra maneira")
                .ask("O que mais você gostaria de fazer?")
                .response
            )
    
    def format_message(self, role, text):
        formated_obj = {
                "role": role,
                "content": [
                    {"type": "text", "text": text}
                ]
            }
        return formated_obj
        
    def get_context_file(self):
        # Construir o caminho completo para o arquivo context.txt
        file_path = os.path.join(os.getcwd(), 'resources', 'context.txt')
    
        try:
            # Lê o conteúdo do arquivo context.txt
            with open(file_path, 'r') as file:
                conteudo = file.read()
            return conteudo
        except Exception as e:
            print(f"Erro ao carregar o arquivo context.txt: {e}")
            return None
    
    def query_bedrock(self, context, messages, model_id):
        """
        Função para executar uma query no Bedrock e obter a resposta.
        """
        bedrock_client = boto3.client("bedrock-runtime")
                
        # Definir os parâmetros de entrada para o método retrieve_and_generate
        input_params = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 500,
            "system": context,
            "messages": messages,
            "temperature": 0.1,
            "top_p": 0.9,
            "top_k": 250
        }
        
        response = bedrock_client.invoke_model(body=json.dumps(input_params), modelId=model_id)
        response_body = json.loads(response.get('body').read())
        outputText = response_body.get('content')[0].get('text')
        cleantext = outputText.strip('\\')
        
        print(response_body)
    
        return cleantext
    

class HelpIntentHandler(AbstractRequestHandler):
    """Handler for Help Intent."""

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_intent_name("AMAZON.HelpIntent")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        _ = handler_input.attributes_manager.request_attributes["_"]
        speak_output = _(data.HELP_MSG)

        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(speak_output)
            .response
        )


class CancelOrStopIntentHandler(AbstractRequestHandler):
    """Single handler for Cancel and Stop Intent."""

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return (ask_utils.is_intent_name("AMAZON.CancelIntent")(handler_input) or
                ask_utils.is_intent_name("AMAZON.StopIntent")(handler_input))

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        _ = handler_input.attributes_manager.request_attributes["_"]
        speak_output = _(data.GOODBYE_MSG)

        return (
            handler_input.response_builder
            .speak(speak_output)
            .response
        )

class FallbackIntentHandler(AbstractRequestHandler):
    """Single handler for Fallback Intent."""
    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_intent_name("AMAZON.FallbackIntent")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        logger.info("In FallbackIntentHandler")
        speech = "Hmm, I'm not sure. You can say Hello or Help. What would you like to do?"
        reprompt = "I didn't catch that. What can I help you with?"

        return handler_input.response_builder.speak(speech).ask(reprompt).response

class SessionEndedRequestHandler(AbstractRequestHandler):
    """Handler for Session End."""

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_request_type("SessionEndedRequest")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response

        # Any cleanup logic goes here.

        return handler_input.response_builder.response


class IntentReflectorHandler(AbstractRequestHandler):
    """The intent reflector is used for interaction model testing and debugging.
    It will simply repeat the intent the user said. You can create custom handlers
    for your intents by defining them above, then also adding them to the request
    handler chain below.
    """

    def can_handle(self, handler_input):
        # type: (HandlerInput) -> bool
        return ask_utils.is_request_type("IntentRequest")(handler_input)

    def handle(self, handler_input):
        # type: (HandlerInput) -> Response
        _ = handler_input.attributes_manager.request_attributes["_"]
        intent_name = ask_utils.get_intent_name(handler_input)
        speak_output = _(data.REFLECTOR_MSG).format(intent_name)

        return (
            handler_input.response_builder
            .speak(speak_output)
            # .ask("add a reprompt if you want to keep the session open for the user to respond")
            .response
        )


class CatchAllExceptionHandler(AbstractExceptionHandler):
    """Generic error handling to capture any syntax or routing errors. If you receive an error
    stating the request handler chain is not found, you have not implemented a handler for
    the intent being invoked or included it in the skill builder below.
    """

    def can_handle(self, handler_input, exception):
        # type: (HandlerInput, Exception) -> bool
        return True

    def handle(self, handler_input, exception):
        # type: (HandlerInput, Exception) -> Response
        logger.error(exception, exc_info=True)
        _ = handler_input.attributes_manager.request_attributes["_"]
        speak_output = _(data.ERROR)

        return (
            handler_input.response_builder
            .speak(speak_output)
            .ask(speak_output)
            .response
        )


class LocalizationInterceptor(AbstractRequestInterceptor):
    """
    Add function to request attributes, that can load locale specific data
    """

    def process(self, handler_input):
        locale = handler_input.request_envelope.request.locale
        i18n = gettext.translation(
            'data', localedir='locales', languages=[locale], fallback=True)
        handler_input.attributes_manager.request_attributes["_"] = i18n.gettext

# The SkillBuilder object acts as the entry point for your skill, routing all request and response
# payloads to the handlers above. Make sure any new handlers or interceptors you've
# defined are included below. The order matters - they're processed top to bottom.

class LogRequestInterceptor(AbstractRequestInterceptor):
    def process(self, handler_input):
        logger.info(f"Request type: {handler_input.request_envelope.request.object_type}")

sb = SkillBuilder()

sb.add_request_handler(LaunchRequestHandler())
sb.add_request_handler(AdicionarAnotacaoIntentHandler())
sb.add_request_handler(HelpIntentHandler())
sb.add_request_handler(CancelOrStopIntentHandler())
sb.add_request_handler(FallbackIntentHandler())
sb.add_request_handler(SessionEndedRequestHandler())
# make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
sb.add_request_handler(IntentReflectorHandler())

sb.add_global_request_interceptor(LocalizationInterceptor())
sb.add_global_request_interceptor(LogRequestInterceptor())

sb.add_exception_handler(CatchAllExceptionHandler())

handler = sb.lambda_handler()